import React, { Component } from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { auth, db } from "../firebase/config";
import "firebase/firestore";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailUser: auth.currentUser ? auth.currentUser.email : "",
      userName: "",
      userPosts: [],
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ profiles: auth.currentUser });
        const mailUser = auth.currentUser.email;

        db.collection("users").onSnapshot((docs) => {
          docs.forEach((doc) => {
            if (doc.data().email === mailUser) {
              this.setState({
                emailUser: doc.data().email,
                userName: doc.data().username,
              });
            }
          });
        });

        db.collection("posts")
          .where("email", "==", mailUser)
          .onSnapshot(
            (docs) => {
              let posts = [];
              docs.forEach((doc) => {
                posts.push({
                  data: doc.data(),
                  id: doc.id,
                });
              });
              this.setState({
                userPosts: posts,
              });
            },
            (error) => {
              console.error(error);
            }
          );
      } else {
        this.props.navigation.navigate("Login");
      }
    });
  }

  handleEliminarPost = (idPost) => {
    db.collection("posts")
      .doc(idPost)
      .delete()
      .then(() => {
        console.log("Post eliminado");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleLogOut = () => {
    auth.signOut()
      .then(() => {
        this.props.navigation.navigate("Login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.logoutButton} onPress={this.handleLogOut}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Mi perfil</Text>
        <View style={styles.profileInfo}>
          <Text style={styles.infoText}>Email: {this.state.emailUser}</Text>
          <Text style={styles.infoText}>Nombre de Usuario: {this.state.userName}</Text>
          <Text style={styles.infoText}>
            Publicaciones realizadas: {this.state.userPosts.length}
          </Text>
        </View>
        <FlatList
          data={this.state.userPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postItem}>
              <View style={styles.postHeader}>
                <Text style={styles.postUserName}>{item.data.userName}</Text>
              </View>
              <View style={styles.postFooter}>
                <Text style={styles.likesText}>
                  Likeado por {item.data.likes ? item.data.likes.length : 0}
                </Text>
                <View>
                  {auth.currentUser.email === item.data.email && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => this.handleEliminarPost(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>Eliminar post</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  profileInfo: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  postItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    marginBottom: 10,
  },
  postUserName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likesText: {
    fontSize: 14,
    color: "#555",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default Profile;