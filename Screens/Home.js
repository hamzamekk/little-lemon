import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { openDatabase } from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";

const db = openDatabase(
  {
    name: "SQLite",
    location: "default",
    createFromLocation: "~SQLite.db",
  },
  () => {},
  (error) => {
    console.log("ERROR: " + error);
  }
);

const Home = () => {
  const [user, setUser] = useState(null);
  const [value, onSetValue] = useState("");
  const [data, setData] = useState([]);
  const [dataFiltered, setDataFiltered] = useState([]);
  const [category, setCategory] = useState("");
  const { navigate } = useNavigation();

  useEffect(() => {
    getUser();
    getData();
  }, []);

  useEffect(() => {
    let newData = [...data];

    if (!!category) {
      newData = newData.filter(
        (item) => item.category === category && item.name.includes(value)
      );
      setDataFiltered(newData);
    } else if (!!value) {
      newData = newData.filter((item) => item.name.includes(value));
      setDataFiltered(newData);
    } else {
      setDataFiltered(newData);
    }
  }, [category, value, data]);

  const onCategoryPress = (cat) => {
    if (cat === category) {
      setCategory("");
    } else {
      setCategory(cat);
    }
  };

  const getUser = async () => {
    const user = await AsyncStorage.getItem("@user");
    if (user) {
      setUser(JSON.parse(user));
    }
  };

  const getDataBase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists DataTable (id integer primary key not null, column_1 int, column_2 int, column_3 text);",
        [],
        (e) => console.log(e)
      );

      tx.executeSql(
        "insert into DataTable (id, column_1, column_2, column_3) values (?, ?, ?, ?)",
        [1, "argument_1", "argument_2", "argument_3"],
        (e) => console.log(e)
      );

      tx.executeSql(
        "select * from DataTable",
        [],
        (_, { rows: { _array } }) => Alert.alert(JSON.stringify(_array)),
        () => console.log("error fetching")
      );
    });
  };

  const getData = () => {
    fetch(
      "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
    )
      .then((data) => data.json())
      .then((data) => setData(data?.menu));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Pressable
          onPress={() => navigate("Profile")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: "5%",
            backgroundColor: "white",
            paddingVertical: "5%",
          }}
        >
          <View />
          <Image
            source={require("../assets/Logo.png")}
            style={{ height: 40, width: "50%" }}
            resizeMode={"contain"}
          />
          {!user?.image && (
            <View
              style={{
                height: 40,
                width: 40,
                backgroundColor: "red",
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>{user?.firstName.slice(2)}</Text>
            </View>
          )}
        </Pressable>
        <View style={{ backgroundColor: "#495E57", padding: "5%" }}>
          <Text
            style={{ fontFamily: "markaz", fontSize: 64, color: "#F4CE14" }}
          >
            Little lemon
          </Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontFamily: "markaz", fontSize: 40, color: "#FFF" }}
              >
                Chicago
              </Text>
              <Text>
                We are a family owned Mediterranean restaurant, focused on
                traditional recipes served with a modern twist.
              </Text>
            </View>
            <Image
              style={{ height: 151, width: 140, borderRadius: 10 }}
              source={require("../assets/Heroimage.png")}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              marginVertical: 20,
            }}
          >
            <Image
              source={require("../assets/magnify.png")}
              style={{ height: 30, width: 30 }}
            />
            <TextInput
              value={value}
              onChangeText={onSetValue}
              style={{ height: 42, flex: 1 }}
            />
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderStyle: "dotted",
            paddingBottom: 5,
          }}
        >
          <Text
            style={{
              fontFamily: "Karla",
              margin: 10,
              fontWeight: "bold",
              fontSize: 24,
            }}
          >
            Order for Delivery
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["Starters", "Mains", "Desserts", "Sides"].map((item) => (
              <TouchableOpacity
                key={item}
                style={{
                  backgroundColor:
                    category === item.toLowerCase() ? "grey" : "#ececec",
                  padding: 10,
                  marginHorizontal: 10,
                  borderRadius: 10,
                }}
                onPress={() => onCategoryPress(item.toLowerCase())}
              >
                <Text
                  style={{
                    fontFamily: "Karla",
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {dataFiltered &&
          dataFiltered?.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  margin: 10,
                  borderBottomWidth: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  borderColor: "#efefef",
                  paddingVertical: 5,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Karla",
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    {item?.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Karla",
                      fontSize: 16,
                    }}
                  >
                    {item?.description}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Karla",
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    {item?.price}
                  </Text>
                </View>
                {item?.image && (
                  <Image
                    source={{
                      uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item?.image}?raw=true`,
                    }}
                    style={{ height: 80, width: 80 }}
                  />
                )}
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default Home;
