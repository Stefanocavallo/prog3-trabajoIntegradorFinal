import React, { Component } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { db } from "../firebase/config";

class userSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      users: [],
      filteredUsers: [],
    };
  }

  handleInputChange = (text) => {
    this.setState({ query: text });
  }

  handleSearch = () => {
    const { query, users } = this.state;
    if (query.trim() !== "") {
      const filtered = users.filter(user => user.userName === query);
      this.setState({ filteredUsers: filtered });
    } else {
      this.setState({ filteredUsers: users });
    }
  }

  componentDidMount() {
    db.collection('users')
      .onSnapshot(snapshot => {
        const users = [];
        snapshot.forEach(doc => {
          users.push(doc.data());
        });
        this.setState({ users: users, filteredUsers: users });
      }, error => {
        console.error("Error al obtener usuarios:", error);
      });
  }


  render() {
    const { filteredUsers } = this.state;
    const usersToShow = filteredUsers.slice(0, 16);

    return (
        <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Buscar Usuario"
          placeholderTextColor="#aaa"
          value={this.state.query}
          onChangeText={this.handleInputChange}
        />
        <TouchableOpacity style={styles.button} onPress={this.handleSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>

        {filteredUsers.length === 0 ? (
          <Text style={styles.noResultsText}>No hay resultados para su búsqueda</Text>
        ) : (
          <FlatList
            data={usersToShow}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Text style={styles.userName}>{item.userName}</Text>
              </View>
            )}
          />
        )}
      </View>
    );
  }
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#f5f5f5",
    },
    textInput: {
      height: 50,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 15,
      backgroundColor: "#fff",
    },
    button: {
      backgroundColor: "#51B9E9",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginVertical: 10,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    noResultsText: {
      textAlign: "center",
      color: "#666",
      marginTop: 20,
      fontSize: 16,
    },
    userItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      backgroundColor: "#fff",
      padding: 10,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    userImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    userName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
  });

export default userSearch;