import processing.video.*;
import java.util.Date;
import ddf.minim.analysis.*;
import ddf.minim.*;

Capture webcam;
ArrayList<FrameSaver> fs;
int threadNB = 10;
int currThread;
int video_width;
int video_height;
int frame_width;
int frame_height;
int posX;
int frameRateCount;

boolean isRecording;
boolean getFirstFrame;
String folder;
int firstFrame;
int timer;

Minim minim;
AudioInput in;
AudioRecorder recorder;

Runtime rtime;

boolean isFinish = false;

PImage sc;

void setup() {
	frameRate(30);
	size(displayWidth, displayHeight, P3D);
	video_width = 640;
  	video_height = 480;
  	frame_height = displayHeight;
  	float ratio = float(displayHeight) / float(video_height);
  	frame_width = int(ratio * video_width);
  	posX = int((displayWidth - frame_width) * .5);
  	String[] cameras = Capture.list();
  	isRecording = false;

  	if (cameras.length == 0) {
	    println("There are no cameras available for capture.");
	    exit();
	} else {
	    println("Available cameras:");
	    for (int i = 0; i < cameras.length; i++) {
			println(cameras[i]);
	    }
  	}

  	webcam = new Capture(this, video_width, video_height, "Lenovo EasyCamera", 30);
  	webcam.start();
  	minim = new Minim(this);
  	in = minim.getLineIn(Minim.STEREO, 2048);

  	fs = new ArrayList<FrameSaver>();
 	for (int i = 0; i < threadNB; ++i) {
 		FrameSaver f = new FrameSaver(this);

 		fs.add(f);
 	}

  	sc = createImage(int(video_width * 2), int(video_height * 2), RGB);
}

void update() {
	
} 

void draw() {
	if(webcam.available()) {
		webcam.read();
	}

	sc.copy(webcam.get(),0,0,sc.width,sc.height,0,0,sc.width,sc.height);
	image(webcam, posX, 0, frame_width, frame_height);
	if(isRecording) {
		if(!getFirstFrame) {
			firstFrame = frameCount;
			getFirstFrame = true;
		}
		int count = frameCount - firstFrame;
		frameRateCount += frameRate;
		fs.get(currThread).indexes.add(count);
		fs.get(currThread).image.add(sc);
		if(fs.get(currThread).image.size() > 0 && !fs.get(currThread).running) {
			fs.get(currThread).running = true;
			currThread = (currThread < threadNB - 1) ? currThread + 1 : 0;
		}
	}

	frame.setTitle(int(frameRate) + " fps");
	
	
}

void mouseReleased() {
	isRecording = !isRecording;
	if(isRecording) {
		timer = millis();
		getFirstFrame = false;
		Date d = new Date();
		long current=d.getTime();
		folder = "video" + str(int(random(0, 100000000))) + int(current) + "\\";
  	 	frameRateCount = 0;

  	 	for (int i = 0; i < threadNB; ++i) {
  	 		
  	 			ArrayList<PImage> im = new ArrayList<PImage>();
	  	 		ArrayList<Integer> in = new ArrayList<Integer>();
	  	 		fs.get(i).setPath(folder, i, im, in);
	  	 	if(!fs.get(i).started) {
	  	 		fs.get(i).start();
  	 		}  	 		
  	 	}

  	 	currThread = 0;

		recorder = minim.createRecorder(in, folder + "myrecording.wav", true);
		recorder.beginRecord();
	} else {
		recorder.endRecord();
		recorder.save();
		for (int i = 0; i < threadNB; ++i) {
			fs.get(i).quit();
		}
		int tFrame = int(frameCount - firstFrame);
		float secTime = (millis() - float(timer)) / 1000;
		println(sketchPath("ffmpeg.bat") + " " + 0 + " " + sketchPath(folder) + " " + tFrame + " " + (float(tFrame) / secTime));
		open(sketchPath("ffmpeg.bat") + " " + 0 + " " + sketchPath(folder) + " " + tFrame + " " + (float(tFrame) / secTime));

		for (int i = 0; i < tFrame; ++i) {

			File f = new File(sketchPath(folder) + "\\v-" + nf(i, 6) + FrameSaver.PICTURE_EXTENSION);
			if (!f.exists()) {
			  println("File does not exist", sketchPath(folder) + "v-" + nf(i, 6) + FrameSaver.PICTURE_EXTENSION);
			} 
		}
	}
}