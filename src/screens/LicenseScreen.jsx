import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LicenseScreen({ onClose }) {
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(7,10,25,0.97)",
        padding: 24,
      }}
    >
      {/* BOTÓN CERRAR */}
      <TouchableOpacity
        onPress={onClose}
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          zIndex: 20,
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: 10,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.15)",
        }}
      >
        <Ionicons name="close" size={22} color="#e5e7eb" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "800",
            marginBottom: 18,
          }}
        >
          MIT License
        </Text>

        <Text style={{ color: "#cbd5e1", marginBottom: 12 }}>
          Copyright (c) {new Date().getFullYear()}
          {" "}CommunityConnect
        </Text>

        <Text style={{ color: "#94a3b8", lineHeight: 22, marginBottom: 14 }}>
          Permission is hereby granted, free of charge, to any person obtaining a
          copy of this software and associated documentation files (the
          “Software”), to deal in the Software without restriction, including
          without limitation the rights to use, copy, modify, merge, publish,
          distribute, sublicense, and/or sell copies of the Software, and to
          permit persons to whom the Software is furnished to do so, subject to
          the following conditions:
        </Text>

        <Text style={{ color: "#94a3b8", lineHeight: 22, marginBottom: 14 }}>
          The above copyright notice and this permission notice shall be included
          in all copies or substantial portions of the Software.
        </Text>

        <Text style={{ color: "#94a3b8", lineHeight: 22 }}>
          THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
          IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
          CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
          TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
          SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </Text>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
