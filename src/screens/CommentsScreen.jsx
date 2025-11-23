// /src/screens/CommentsScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/dashboardStyles";
import { eventService } from "../services/eventService";

export default function CommentsScreen({ eventId, user, onClose }) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(1); // ⭐ default 1
  const [sending, setSending] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);

  const [usersById, setUsersById] = useState({});

  const [fadeAnim] = useState(new Animated.Value(0));

  // Cargar comentarios y usuarios
  useEffect(() => {
    loadUsers();
    loadComments();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await eventService.getAllUsers();
      const list = Array.isArray(data) ? data : data?.users || data || [];
      const map = {};
      list.forEach((u) => {
        if (!u) return;
        map[u.id] = u;
      });
      setUsersById(map);
    } catch (err) {
      console.log("❌ Error al cargar usuarios:", err.message);
      // No es crítico, solo nombre
    }
  };

  const loadComments = async () => {
    try {
      setLoadingComments(true);
      const data = await eventService.getEventComments(eventId);
      let list = Array.isArray(data) ? data : data?.comments || [];

      // Ordenar por fecha asc (el de abajo = más reciente)
      list = [...list].sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at) : new Date(0);
        const db = b.created_at ? new Date(b.created_at) : new Date(0);
        return da - db;
      });

      setComments(list);
    } catch (err) {
      console.log("❌ Error al cargar comentarios:", err);
      Alert.alert("Error", "No se pudieron cargar los comentarios");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSend = async () => {
    if (!newComment.trim()) return;

    try {
      setSending(true);

      if (editingCommentId) {
        // 🔄 Modo edición
        await eventService.updateComment(editingCommentId, {
          content: newComment.trim(),
          rating,
        });
      } else {
        // 🆕 Nuevo comentario (rating puede ser 0)
        await eventService.addComment(eventId, user.id, newComment.trim(), rating);
      }

      setNewComment("");
      setRating(1); // volver al default 1
      setEditingCommentId(null);
      await loadComments();
    } catch (err) {
      console.log("❌ Error al enviar comentario:", err);
      Alert.alert("Error", "No se pudo enviar el comentario");
    } finally {
      setSending(false);
    }
  };

  const toggleStar = (star) => {
    // Si ya está seleccionada -> rating = 0
    if (star === rating) {
      setRating(0);
    } else {
      setRating(star);
    }
  };

  const renderStars = () => (
    <View style={{ flexDirection: "row", marginBottom: 6 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => toggleStar(star)}>
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={22}
            color="#facc15"
            style={{ marginRight: 4 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setNewComment(comment.content || "");
    setRating(
      typeof comment.rating === "number" && comment.rating >= 0
        ? comment.rating
        : 1
    );
  };

  const handleDeleteComment = (commentId) => {
    Alert.alert(
      "Eliminar comentario",
      "¿Seguro que deseas eliminar este comentario?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eventService.deleteComment(commentId);
              if (editingCommentId === commentId) {
                setEditingCommentId(null);
                setNewComment("");
                setRating(1);
              }
              await loadComments();
            } catch (err) {
              console.log("❌ Error al eliminar comentario:", err);
              Alert.alert("Error", "No se pudo eliminar el comentario");
            }
          },
        },
      ]
    );
  };

  const getDisplayName = (c) => {
    if (c.user_name) return c.user_name;
    const u = usersById[c.user_id];
    if (!u) return "Usuario";
    return u.full_name || u.name || u.username || u.email || "Usuario";
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={styles.detailOverlay}>
        {/* BOTÓN DE CIERRE */}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color="#e5e7eb" />
        </TouchableOpacity>

        {/* CABECERA */}
        <View style={{ paddingTop: 60, paddingHorizontal: 24 }}>
          <Text
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: "800",
              marginBottom: 6,
            }}
          >
            Comentarios
          </Text>

          {editingCommentId && (
            <Text
              style={{
                color: "#facc15",
                fontSize: 12,
                marginBottom: 4,
              }}
            >
              Editando tu comentario...
            </Text>
          )}
        </View>

        {/* LISTA DE COMENTARIOS CON FADE-IN */}
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {loadingComments ? (
              <ActivityIndicator size="large" color="#06f7ff" />
            ) : comments.length === 0 ? (
              <Text style={{ color: "#94a3b8" }}>
                Aún no hay comentarios. Sé el primero en opinar.
              </Text>
            ) : (
              comments.map((c, index) => {
                const isMine = c.user_id === user.id;
                const displayName = getDisplayName(c);

                return (
                  <View
                    key={c.id || index}
                    style={{
                      marginBottom: 16,
                      alignSelf: isMine ? "flex-end" : "flex-start",
                      maxWidth: "90%",
                    }}
                  >
                    <View
                      style={{
                        padding: 12,
                        borderRadius: 14,
                        backgroundColor: isMine
                          ? "rgba(59,130,246,0.25)"
                          : "rgba(15,23,42,0.9)",
                        borderWidth: 1,
                        borderColor: isMine
                          ? "rgba(96,165,250,0.9)"
                          : "rgba(148,163,184,0.5)",
                      }}
                    >
                      {/* Header: nombre + rating + acciones */}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <Text
                          style={{
                            color: "#e5e7eb",
                            fontWeight: "700",
                            fontSize: 13,
                          }}
                        >
                          {displayName}
                        </Text>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {c.rating > 0 && (
                            <View style={{ flexDirection: "row" }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons
                                  key={star}
                                  name={star <= c.rating ? "star" : "star-outline"}
                                  size={13}
                                  color="#facc15"
                                  style={{ marginLeft: 1 }}
                                />
                              ))}
                            </View>
                          )}

                          {isMine && (
                            <View style={{ flexDirection: "row" }}>
                              <TouchableOpacity
                                onPress={() => handleEditComment(c)}
                                style={{ marginLeft: 8 }}
                              >
                                <Ionicons
                                  name="pencil-outline"
                                  size={16}
                                  color="#e5e7eb"
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleDeleteComment(c.id)}
                                style={{ marginLeft: 6 }}
                              >
                                <Ionicons
                                  name="trash-outline"
                                  size={16}
                                  color="#fecaca"
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>

                      {/* Contenido */}
                      <Text
                        style={{
                          color: "#e5e7eb",
                          lineHeight: 18,
                          fontSize: 13,
                        }}
                      >
                        {c.content}
                      </Text>

                      {/* Fecha */}
                      {c.created_at && (
                        <Text
                          style={{
                            color: "#94a3b8",
                            fontSize: 10,
                            marginTop: 6,
                            textAlign: "right",
                          }}
                        >
                          {new Date(c.created_at).toLocaleString()}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </Animated.View>

        {/* INPUT + RATING ABAJO (SUBE CON TECLADO) */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 18,
            backgroundColor: "rgba(15,23,42,0.97)",
            borderTopWidth: 1,
            borderTopColor: "rgba(148,163,184,0.4)",
          }}
        >
          {renderStars()}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(15,23,42,1)",
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: "rgba(148,163,184,0.6)",
            }}
          >
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder={
                editingCommentId
                  ? "Edita tu comentario..."
                  : "Escribe un comentario..."
              }
              placeholderTextColor="#9ca3af"
              style={{
                flex: 1,
                color: "white",
                fontSize: 14,
                paddingRight: 10,
              }}
              multiline
            />

            {editingCommentId && (
              <TouchableOpacity
                onPress={() => {
                  setEditingCommentId(null);
                  setNewComment("");
                  setRating(1);
                }}
                style={{ marginRight: 8 }}
              >
                <Ionicons name="close-circle" size={20} color="#f97373" />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={handleSend} disabled={sending}>
              {sending ? (
                <ActivityIndicator size="small" color="#06f7ff" />
              ) : (
                <Ionicons
                  name="send"
                  size={22}
                  color={newComment.trim() ? "#06f7ff" : "#64748b"}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
