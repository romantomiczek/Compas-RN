import { StatusBar } from "expo-status-bar";
import React, { Component, useState, useEffect } from "react";
import { Grid, Col, Row } from "react-native-easy-grid";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { LightSensor, Magnetometer } from "expo-sensors";
import LPF from "lpf";

let magnetometer = 0;

export default function App() {
  /*this.state = {
    magnetometer: "0",
  };*/

  const { height, width } = Dimensions.get("window");
  const [{ illuminance }, setDataLightSensor] = useState({ illuminance: 0 });

  const [{ x, y, z }, setDataMagnetometer] = useState({ x: 0, y: 0, z: 0 });
  const [magnetometerData, setMagnetometerData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  Magnetometer.setUpdateInterval(100);

  useEffect(() => {
    LightSensor.addListener(setDataLightSensor);
    //Magnetometer.addListener(setDataMagnetometer);
    //    Magnetometer.addListener(setMagnetometerData);
    Magnetometer.addListener((MagnetometerDataNew) => {
      setMagnetometerData(MagnetometerDataNew);
      this.magnetometer = _angle(MagnetometerDataNew);
      console.log(this.magnetometer);
    });

    return () => {
      LightSensor.removeAllListeners();
      Magnetometer.removeAllListeners();
    };
  }, []);

  _angle = (magnetometer) => {
    let angle = 0;
    if (magnetometer) {
      let { x, y } = magnetometer;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(LPF.next(angle));
  };

  _direction = (degree) => {
    if (degree >= 22.5 && degree < 67.5) {
      return "NE";
    } else if (degree >= 67.5 && degree < 112.5) {
      return "E";
    } else if (degree >= 112.5 && degree < 157.5) {
      return "SE";
    } else if (degree >= 157.5 && degree < 202.5) {
      return "S";
    } else if (degree >= 202.5 && degree < 247.5) {
      return "SW";
    } else if (degree >= 247.5 && degree < 292.5) {
      return "W";
    } else if (degree >= 292.5 && degree < 337.5) {
      return "NW";
    } else {
      return "N";
    }
  };

  _degree = (magnetometer) => {
    return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
  };

  return (
    /*<View style={styles.container}>
      <Text>Hello?</Text>
      <Text>Screen width: {width}</Text>
      <Text>Screen height: {height}</Text>
      <Text>
        Illuminance:{" "}
        {Platform.OS === "android"
          ? `${illuminance} lx`
          : `Only available on Android`}
      </Text>
      <Text style={styles.text}>Magnetometer:</Text>
      <Text style={styles.text}>x: {x.toFixed(1)}</Text>
      <Text style={styles.text}>y: {y.toFixed(1)}</Text>
      <Text style={styles.text}>z: {z.toFixed(1)}</Text>
      <Text style={styles.text}>data: {this._degree(this.magnetometer)}</Text>
      <Text style={styles.text}>
        {" "}
        {this._direction(this._degree(this.magnetometer))}
      </Text>
      <StatusBar style="auto" />
    </View>*/
    <Grid style={{ backgroundColor: "black" }}>
      <Row style={{ alignItems: "center" }} size={0.9}>
        <Col style={{ alignItems: "center" }}>
          <Text
            style={{
              color: "#fff",
              fontSize: height / 26,
              fontWeight: "bold",
            }}
          >
            {this._direction(this._degree(this.magnetometer))}
          </Text>
        </Col>
      </Row>

      <Row style={{ alignItems: "center" }} size={0.1}>
        <Col style={{ alignItems: "center" }}>
          <View style={{ width: width, alignItems: "center", bottom: 0 }}>
            <Image
              source={require("./assets/compass_pointer.png")}
              style={{
                height: height / 26,
                resizeMode: "contain",
              }}
            />
          </View>
        </Col>
      </Row>

      <Row style={{ alignItems: "center" }} size={2}>
        <Text
          style={{
            color: "#fff",
            fontSize: height / 27,
            width: width,
            position: "absolute",
            textAlign: "center",
          }}
        >
          {this._degree(this.magnetometer)}°
        </Text>

        <Col style={{ alignItems: "center" }}>
          <Image
            source={require("./assets/compass_bg.png")}
            style={{
              height: width - 80,
              justifyContent: "center",
              alignItems: "center",
              resizeMode: "contain",
              transform: [{ rotate: 360 - this.magnetometer + "deg" }],
            }}
          />
        </Col>
      </Row>

      <Row style={{ alignItems: "center" }} size={1}>
        <Col style={{ alignItems: "center" }}>
          <Text style={{ color: "#fff" }}>RomanTomiczek</Text>
        </Col>
      </Row>
    </Grid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
