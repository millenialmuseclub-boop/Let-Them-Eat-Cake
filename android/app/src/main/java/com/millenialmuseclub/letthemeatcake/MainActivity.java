package com.millenialmuseclub.letthemeatcake;

import android.graphics.Color;
import android.os.Bundle;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Edge-to-edge: content draws behind the (transparent) status bar for a
    // true full-screen feel, but we pad the decor view by the nav bar inset
    // so WebView content always stops above the Android system nav bar.
    WindowCompat.setDecorFitsSystemWindow(getWindow(), false);
    getWindow().setStatusBarColor(Color.TRANSPARENT);
    ViewCompat.setOnApplyWindowInsetsListener(
        getWindow().getDecorView(),
        (view, insets) -> {
          Insets navBar = insets.getInsets(WindowInsetsCompat.Type.navigationBars());
          view.setPadding(0, 0, 0, navBar.bottom);
          return insets;
        });
  }
}
