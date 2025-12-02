import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

interface PlotlyChartProps {
  data: any[];
  layout: any;
  config?: any;
  width?: number;
}

const screenWidth = Dimensions.get("window").width;

const PlotlyChart: React.FC<PlotlyChartProps> = ({
  data,
  layout,
  config = {},
  width = screenWidth - 30,
}) => {
  // הכנת layout עם width ו-height
  const finalLayout = {
    ...layout,
    width: width,
    height: 350, // ← שנה מ-300 ל-350
    autosize: false,
  };

  // הכנת config
  const finalConfig = {
    responsive: false,
    displayModeBar: true,
    modeBarButtonsToRemove: ["pan2d", "select2d", "lasso2d", "autoScale2d"],
    displaylogo: false,
    scrollZoom: true,
    ...config,
  };

  const html = `
    <!DOCTYPE html>
    <html dir="ltr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes">
        <script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          #chart {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div id="chart"></div>
        <script>
          const data = ${JSON.stringify(data)};
          const layout = ${JSON.stringify(finalLayout)};
          const config = ${JSON.stringify(finalConfig)};
          
          Plotly.newPlot('chart', data, layout, config);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={styles.scrollView}
        contentContainerStyle={{ width }}
      >
        <WebView
          originWhitelist={["*"]}
          source={{ html }}
          style={[styles.webview, { width, height: 300 }]}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 350, // ← שנה מ-300 ל-350
    width: "100%",
  },
  scrollView: {
    flex: 1,
  },
  webview: {
    backgroundColor: "transparent",
  },
});

export default PlotlyChart;
