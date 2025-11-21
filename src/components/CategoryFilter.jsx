import React from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/dashboardStyles";

const CategoryFilter = ({ selected, onSelect }) => {
  const categories = [
    { id: "all", name: "Todos", icon: "apps" },
    { id: "tecnologia", name: "Tecnología", icon: "laptop" },
    { id: "musica", name: "Música", icon: "musical-notes" },
    { id: "negocios", name: "Negocios", icon: "briefcase" },
    { id: "salud", name: "Salud", icon: "heart" },
    { id: "deportes", name: "Deportes", icon: "football" },
    { id: "arte", name: "Arte", icon: "color-palette" },
  ];

  return (
    <View style={styles.categoriesContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            style={[styles.categoryPill, selected === cat.id && styles.categoryPillActive]}
          >
            <Ionicons name={cat.icon} size={16} color={selected === cat.id ? "#06f7ff" : "#9aa6bf"} />
            <Text style={[styles.categoryText, selected === cat.id && styles.categoryTextActive]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryFilter;
