import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Slider,
  Modal,
} from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Circle,
  Callout,
} from "react-native-maps";
import Carousel from "react-native-snap-carousel";
import * as Location from "expo-location";
import { connect } from "react-redux";
import { loadBathrooms } from "../store/bathrooms";
import BathroomView from "./BathroomView";
import GoogleSearchBar from "./GoogleSearchBar";
import Filter from "./Filter";
import AddBathroom from "./AddBathroom";
import headerimg from "../assets/header-img.png";
import {
  Icon as IconB,
  Icon as IconFilter,
  Header as HeaderB,
} from "react-native-elements";

class GoogleMapView extends Component {
  constructor() {
    super();
    this.state = {
      region: null,
      location: null,
      markers: [],
      radius: 1000,
      errorMsg: null,
      modalVisible: false,
      modal2Visible: false,
      modalFilter: false,
      idx: 0,
      // filter: "",
      unisexFilter: false,
      accessibleFilter: false,
      changingFilter: false,
    };
    this.onSearchRegionChange = this.onSearchRegionChange.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
  }

  async componentDidMount() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      this.setState({ errorMsg: "Permission denied" });
      this.setState({
        region: {
          latitude: 40.7061,
          longitude: -73.9969,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
      });
    } else {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({ location });
      this.setState({
        region: {
          latitude: this.state.location.coords.latitude,
          longitude: this.state.location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
      });
    }
    await this.props.load(
      this.state.region,
      this.state.radius,
      this.state.unisexFilter,
      this.state.accessibleFilter,
      this.state.changingFilter
    );
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      (prevState.region !== this.state.region && prevState.region !== null) ||
      prevState.radius !== this.state.radius ||
      prevState.unisexFilter !== this.state.unisexFilter ||
      prevState.accessibleFilter !== this.state.accessibleFilter ||
      prevState.changingFilter !== this.state.changingFilter
    ) {
      await this.props.load(
        this.state.region,
        this.state.radius,
        this.state.unisexFilter,
        this.state.accessibleFilter,
        this.state.changingFilter
      );
    }
  }

  onRegionChangeComplete(event) {
    this.setState({
      region: {
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    });
  }

  onSearchRegionChange(coordinates) {
    this.setState({
      region: {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    });
    this._map.animateToRegion({
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }

  onCarouselItemChange = (index) => {
    let location = this.props.bathrooms[index];
    this.setState({ idx: index });
    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    this.state.markers[index].showCallout();
  };

  onMarkerPressed = (location, index) => {
    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    this._carousel.snapToItem(index);
  };

  backButton = () => {
    this.setState({
      modalVisible: false,
      modal2Visible: false,
      modalFilter: false,
    });
  };

  renderCarouselItem = ({ item }) => {
    return (
      <View style={styles.cardContainer}>
        <Text
          style={styles.cardTitle}
          onPress={() => this.setState({ modalVisible: true })}
        >
          {item.establishment}
        </Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          on
        >
          <BathroomView backButton={this.backButton} index={this.state.idx} />
        </Modal>
      </View>
    );
  };

  async getRestrooms() {
    const newRadius = await event.target.value;
    this.setState({ radius: newRadius });
  }

  unisexFn = (unisexFilter) => this.setState({ unisexFilter });
  accessibleFn = (accessibleFilter) => this.setState({ accessibleFilter });
  changingFn = (changingFilter) => this.setState({ changingFilter });

  render() {
    if (!this.state.region) return <Text>Loading...</Text>;
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={(map) => (this._map = map)}
          style={styles.mapStyle}
          initialRegion={this.state.region}
          showsUserLocation={true}
        >
          <Marker
            pinColor="orange"
            draggable
            onDragEnd={this.onRegionChangeComplete}
            coordinate={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude,
            }}
          />
          {this.props.bathrooms.map((marker, index) => (
            <Marker
              //image={iconmarker}
              key={index}
              ref={(ref) => (this.state.markers[index] = ref)}
              onPress={() => this.onMarkerPressed(marker, index)}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
            >
              <Callout
                style={styles.callout}
                onPress={() => this.setState({ modalVisible: true })}
              >
                <Text>{marker.establishment}</Text>
                <Text>{`Go: ${marker.directions}`}</Text>
              </Callout>
            </Marker>
          ))}
          <Circle center={this.state.region} radius={this.state.radius + 500} />
        </MapView>
        <HeaderB backgroundImage={headerimg}></HeaderB>
        <View style={styles.addFilter}>
          <IconFilter
            size={36}
            name="sort"
            type="material"
            color="#0077F6"
            onPress={() =>
              this.setState({ modalFilter: !this.state.modalFilter })
            }
          />
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalFilter}
          on
        >
          <View style={styles.centeredView}>
            <View style={styles.modalFilter}>
              <Filter
                backButton={this.backButton}
                // filterFn={this.filterFn}
                unisexFn={this.unisexFn}
                accessibleFn={this.accessibleFn}
                changingFn={this.changingFn}
                unisexFilter={this.state.unisexFilter}
                accessibleFilter={this.state.accessibleFilter}
                changingFilter={this.state.changingFilter}
              />
            </View>
          </View>
        </Modal>
        <View style={styles.add}>
          <IconB
            size={40}
            name="add-circle"
            type="FontAwesome"
            color="#0077F6"
            underlayColor="purple"
            onPress={() => {
              this.setState({ modal2Visible: true });
            }}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modal2Visible}
            on
          >
            <AddBathroom
              backButton={this.backButton}
              region={this.state.region}
            />
          </Modal>
        </View>
        <View style={styles.searchBar}>
          <GoogleSearchBar onSearchRegionChange={this.onSearchRegionChange} />
        </View>
        <Carousel
          ref={(c) => {
            this._carousel = c;
          }}
          data={this.props.bathrooms}
          containerCustomStyle={styles.carousel}
          renderItem={this.renderCarouselItem}
          sliderWidth={Dimensions.get("window").width}
          itemWidth={300}
          removeClippedSubviews={false}
          onSnapToItem={(index) => this.onCarouselItemChange(index)}
        />
        <Slider
          style={styles.slider}
          value={this.state.radius}
          maximumValue={2000}
          minimumValue={200}
          step={100}
          onValueChange={(value) => this.setState({ radius: value })}
        >
          <Text>{this.state.radius} meters</Text>
        </Slider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: "absolute",
    top: 10,
  },
  carousel: {
    position: "absolute",
    bottom: 0,
    marginBottom: 70,
  },
  cardContainer: {
    backgroundColor: "#0077F6",
    height: 50,
    width: 300,
    padding: 10,
    borderRadius: 10,
  },
  cardTitle: {
    color: "white",
    fontSize: 20,
    alignSelf: "center",
  },
  permissions: {
    marginTop: 10,
    color: "red",
  },
  slider: {
    flex: 1,
    position: "absolute",
    alignSelf: "center",
    bottom: 15,
    width: "85%",
  },
  searchBar: {
    flex: 1,
    position: "absolute",
    alignSelf: "center",
    width: "85%",
    marginTop: 30,
  },
  add: {
    flex: 1,
    color: "blue",
    position: "absolute",
    alignSelf: "flex-end",
    marginTop: 100,
  },
  addFilter: {
    flex: 1,
    position: "absolute",
    alignSelf: "flex-end",
    marginTop: 130,
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalFilter: {
    height: 250,
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 15,
      height: 15,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
});

const mapStateToProps = ({ bathrooms }) => ({ bathrooms });

const mapDispatchToProps = (dispatch) => {
  return {
    load(region, radius, unisexFilter, accessibleFilter, changingFilter) {
      dispatch(
        loadBathrooms(
          region,
          radius,
          unisexFilter,
          accessibleFilter,
          changingFilter
        )
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GoogleMapView);
