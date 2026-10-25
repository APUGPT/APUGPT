package com.apugpt.app;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;

public class MainActivity extends Activity {

private WebView webView;

@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    webView = new WebView(this);
    webView.getSettings().setJavaScriptEnabled(true);

    webView.setWebViewClient(new WebViewClient() {
        @Override
        public boolean shouldOverrideUrlLoading(
                WebView view, WebResourceRequest request) {

            Uri uri = request.getUrl();
            String url = uri.toString();

            if (url.startsWith("https://www.instagram.com/") ||
                url.startsWith("https://instagram.com/")) {
                Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                startActivity(intent);
                return true;
            }

            return false;
        }

        @Override
        public boolean shouldOverrideUrlLoading(
                WebView view, String url) {

            if (url.startsWith("https://www.instagram.com/") ||
                url.startsWith("https://instagram.com/")) {
                Intent intent = new Intent(Intent.ACTION_VIEW,
                        Uri.parse(url));
                startActivity(intent);
                return true;
            }

            return false;
        }
    });

    webView.loadUrl("file:///android_asset/index.html");
    setContentView(webView);
}

}
