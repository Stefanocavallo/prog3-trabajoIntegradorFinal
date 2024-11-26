import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db, auth } from '../firebase/config';

class Posts extends Component {

  constructor(props) {
    super(props);

    this.state = {
      posteo: "",
    };
  }

  newPost = () => {
    db.collection("posts").add({
      createdAt: new Date(),
      email: auth.currentUser.email,
      likes: [],
      posteo: this.state.posteo,
    })
      .then(() => {
        this.setState({ posteo: "" });
        this.props.navigation.navigate('Profile');
      })
      .catch((error) => {
        console.error("Error al crear el posteo: ", error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Escribe lo que estás pensando</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="default"
          placeholder="En qué estás pensando..."
          onChangeText={(text) => this.setState({ posteo: text })}
          value={this.state.posteo}
        />
        <TouchableOpacity style={styles.button} onPress={this.newPost}>
          <Text style={styles.buttonText}>Postear</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5", // Fondo claro para la vista
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333", // Color del texto principal
  },
  textInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff", // Fondo blanco para el campo de texto
  },
  button: {
    backgroundColor: "#51B9E9", // Azul claro
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff", // Texto blanco
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default Posts;