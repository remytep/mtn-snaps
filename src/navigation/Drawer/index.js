import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import Loader from "../../components/loader";
import NotificationsScreen from "../../screens/UserScreens/NotificationsScreen";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const disconnect = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem("email");
      await AsyncStorage.removeItem("token");
      setTimeout(() => {
        setLoading(false);
        navigation.replace("Auth");
      }, 700);
    } catch (e) {
      console.warn(e);
    }
  };
  return (
    <DrawerContentScrollView {...props}>
      <Loader loading={loading} />
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={() => disconnect()}
        labelStyle={{ fontSize: 20 }}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="NotificationsScreen"
      useLegacyImplementation
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        animationEnabled: false,
        headerTintColor: "black",
        headerStyle: {
          backgroundColor: "orange",
        },
        drawerActiveTintColor: "orange",
        drawerInactiveTintColor: "orange",
        drawerStyle: {
          paddingTop: 50,
          backgroundColor: "#gray",
          width: 240,
        },
        drawerLabelStyle: {
          fontSize: 20,
        },
      }}
    >
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
    </Drawer.Navigator>
  );
}
