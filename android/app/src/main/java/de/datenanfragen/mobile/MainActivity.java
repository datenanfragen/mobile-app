package de.datenanfragen.mobile;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import de.datenanfragen.mobile.plugins.Email.EmailPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(EmailPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
