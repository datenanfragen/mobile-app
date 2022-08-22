package de.datenanfragen.mobile.plugins.Email;

import android.util.Log;

import org.json.JSONArray;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;

import com.google.gson.Gson;
import com.google.gson.JsonElement;

import java.util.Objects;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;

@CapacitorPlugin(name = "Email")
public class EmailPlugin extends Plugin {
    private Email implementation;

    @Override
    public void load() {
        implementation = new Email();
    }

    @PluginMethod()
    public void setCredentials(PluginCall call) {
        for (String arg : new String[]{"imapUser", "imapPassword", "imapHost", "imapPort",
                "imapUseSsl", "imapUseStartTls", "smtpUser", "smtpPassword", "smtpHost",
                "smtpPort", "smtpUseSsl", "smtpUseStartTls"}) {
            if (!call.hasOption(arg)) {
                Log.e("EmailPlugin", "Missing " + arg + " in createOrUpdateSession() call.");
                call.reject("createOrUpdateSession() call failed.");
                return;
            }
        }

        try {
            implementation.setCredentials(
                    call.getString("imapUser"),
                    call.getString("imapPassword"),
                    call.getString("imapHost"),
                    Objects.requireNonNull(call.getInt("imapPort")).toString(),
                    Objects.requireNonNull(call.getBoolean("imapUseSsl")).toString(),
                    Objects.requireNonNull(call.getBoolean("imapUseStartTls")).toString(),

                    call.getString("smtpUser"),
                    call.getString("smtpPassword"),
                    call.getString("smtpHost"),
                    Objects.requireNonNull(call.getInt("smtpPort")).toString(),
                    Objects.requireNonNull(call.getBoolean("smtpUseSsl")).toString(),
                    Objects.requireNonNull(call.getBoolean("smtpUseStartTls")).toString()
            );
            call.resolve();
        } catch (Exception e) {
            Log.e("EmailPlugin", "createOrUpdateSession() call failed.", e);
            call.reject("createOrUpdateSession() call failed.");
        }
    }

    @PluginMethod()
    public void verifyConnection(PluginCall call) {
        JSObject ret = new JSObject();
        try {
            implementation.ensureConnection();
            ret.put("valid", true);
            call.resolve(ret);
        } catch (MessagingException e) {
            ret.put("valid", false);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e("EmailPlugin", "verifyConnection() call failed.", e);
            call.reject("verifyConnection() call failed.");
        }
    }

    @PluginMethod()
    public void sendMessage(PluginCall call) {
        for (String arg : new String[]{"from", "to", "subject", "text"}) {
            if (!call.hasOption(arg)) {
                Log.e("EmailPlugin", "Missing " + arg + " in sendMessage() call.");
                call.reject("sendMessage() call failed.");
                return;
            }
        }

        try {
            implementation.sendMessage(
                    call.getString("from"),
                    call.getArray("to").toList().toArray(new String[0]),
                    call.getString("subject"),
                    call.getString("text")
            );
            call.resolve();
        } catch (Exception e) {
            Log.e("EmailPlugin", "sendMessage() call failed.", e);
            call.reject("sendMessage() call failed.");
        }
    }

    @PluginMethod()
    public void getMessages(PluginCall call) {
        JSObject ret = new JSObject();
        try {
            Message[] messages = implementation.getMessages();

            // TODO: This is a very inefficient way of JSON-ifying the messages and we shouldn't
            //  return the full object anyway.
            Gson gson = new Gson();
            JsonElement json = gson.toJsonTree(messages);
            ret.put("messages", new JSONArray(json.toString()));
            call.resolve(ret);
        } catch (Exception e) {
            Log.e("EmailPlugin", "getMessages() call failed.", e);
            call.reject("getMessages() call failed.");
        }
    }
}
