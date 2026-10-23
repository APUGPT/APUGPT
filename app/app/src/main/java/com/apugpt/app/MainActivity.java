package com.apugpt.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.graphics.Color;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.LinearLayout;

public class MainActivity extends Activity {
@Override
protected void onCreate(Bundle savedInstanceState) {
super.onCreate(savedInstanceState);

    LinearLayout layout = new LinearLayout(this);
    layout.setOrientation(LinearLayout.VERTICAL);
    layout.setGravity(17);
    layout.setBackgroundColor(Color.rgb(12, 17, 35));

    TextView title = new TextView(this);
    title.setText("ApuGPT");
    title.setTextColor(Color.rgb(232, 190, 90));
    title.setTextSize(36);
    title.setGravity(17);
    title.setPadding(20, 40, 20, 20);

    TextView subtitle = new TextView(this);
    subtitle.setText("Your AI Assistant");
    subtitle.setTextColor(Color.WHITE);
    subtitle.setTextSize(18);
    subtitle.setGravity(17);

    layout.addView(title);
    layout.addView(subtitle);
    setContentView(layout);
}

}
