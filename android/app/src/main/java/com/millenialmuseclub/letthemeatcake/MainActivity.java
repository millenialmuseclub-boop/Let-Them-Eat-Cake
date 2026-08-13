package com.millenialmuseclub.letthemeatcake;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Full screen behind the (transparent) status bar. Only LAYOUT_FULLSCREEN
    // is set -- not LAYOUT_HIDE_NAVIGATION -- so the Android system nav bar
    // keeps its normal reserved space and is never drawn under.
    getWindow().setStatusBarColor(Color.TRANSPARENT);
    getWindow()
        .getDecorView()
        .setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
  }
}
