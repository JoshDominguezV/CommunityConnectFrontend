// /src/components/CategoryFilter.jsx
import React from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/dashboardStyles";

const filters = [
  { id: "all", label: "Todos", icon: "grid-outline" },
  { id: "today", label: "Hoy", icon: "sunny-outline" },
  { id: "upcoming", label: "Próximos", icon: "calendar-outline" },
  { id: "past", label: "Pasados", icon: "time-outline" },
];

const CategoryFilter = ({ selected, onSelect }) => {
  return (
    <View style={styles.categoriesContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.id}
            onPress={() => onSelect(f.id)}
            style={[
              styles.categoryPill,
              selected === f.id && styles.categoryPillActive,
            ]}
          >
            <Ionicons
              name={f.icon}
              size={16}
              color={selected === f.id ? "#06f7ff" : "#9aa6bf"}
            />
            <Text
              style={[
                styles.categoryText,
                selected === f.id && styles.categoryTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryFilter;
