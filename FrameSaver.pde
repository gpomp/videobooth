import processing.core.PApplet;

public class FrameSaver extends Thread {

  public boolean running;
  public static final String PICTURE_EXTENSION = ".jpg";
  public static final int CAPS = 1;

  public ArrayList<PImage> image;
  public ArrayList<Integer> indexes;
  public boolean started;
  public int index;

  private String path;
  
  private PApplet p;
  
  private int id = 0;
  
   
  public FrameSaver (final PApplet p) {
    this.p = p;
    
  }
  
  public void setPath(String p, int c, ArrayList<PImage> i, ArrayList<Integer> in) {
    path = p;
    id = c;
    image = i;
    indexes = in;
  }
   
  public void start() {
    running = false;
    try {
      super.start();
      System.out.println("FrameSaver started."+ this);
      started = true;
    }
    catch (java.lang.IllegalThreadStateException e) {
      System.out.println("cannot execute! " + e);
    }
  }
   
  public void run() {
    while(true){
      if(running) {
        running = false;
        int l = image.size();
        for (int i = 0; i < l; ++i) {
          image.get(i).save(path + "v-"+nf(indexes.get(i), 6) + FrameSaver.PICTURE_EXTENSION);
        }

        
        image.clear();
        indexes.clear();

      }
      

        try {
          sleep((long)(10));
        } catch(Exception e) {
          p.println("error with " + e);
        }

    }

  }
   
  public void quit() {
    System.out.println("Frame Saver Thread Exiting...");
    //timer.stop();
    running = false;
    for (int i = 0; i < image.size(); ++i) {
      //image.get(i) = null;
      image.get(i).save(path + "v-"+nf(indexes.get(i), 6)+FrameSaver.PICTURE_EXTENSION);
    }
    image.clear();
    indexes.clear();
  } 
}