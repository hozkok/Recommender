/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.ionicframework.client910574;

import android.os.Bundle;
import org.apache.cordova.*;

// below imports are added manually for webview testing
import android.os.Build;
import android.util.Log;
import android.content.pm.ApplicationInfo;
import android.webkit.WebView;

public class MainActivity extends CordovaActivity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        //below if statement is added manually for webview testing
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT){
            if(0 != (getApplicationInfo().flags = ApplicationInfo.FLAG_DEBUGGABLE)){
                Log.i("Your app", "Enabling web debugging");
                WebView.setWebContentsDebuggingEnabled(true);
            }
        }

        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
    }
}