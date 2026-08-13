package com.millenialmuseclub.letthemeatcake;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.WindowInsets;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Edge-to-edge: content draws behind the (transparent) status bar for a
    // true full-screen feel, but we pad the decor view by the nav bar inset
    // so WebView content always stops above the Android system nav bar.
    // Platform APIs only (added in API 30) -- older devices just keep the
    // default, non-edge-to-edge system bar behavior.
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      getWindow().setDecorFitsSystemWindow(false);
      getWindow().setStatusBarColor(Color.TRANSPARENT);
      getWindow()
          .getDecorView()
          .setOnApplyWindowInsetsListener(
              (view, insets) -> {
                int navBarBottom = insets.getInsets(WindowInsets.Type.navigationBars()).bottom;
                view.setPadding(0, 0, 0, navBarBottom);
                return insets;
              });
    }
  }
}
