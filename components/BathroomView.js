import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Button
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "react-native-elements";
import { Images, materialTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { connect } from "react-redux";

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;

class BathroomView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
  }
  async componentDidMount() {
    this.setState({ index: this.props.index });
  }
  async componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ index: this.props.index });
    }
  }
  render() {
    const backButton = this.props.backButton;
    const index = this.state.index || 0;
    const bathroom = this.props.bathrooms[index] || {};
    const bathroomReviews = this.props.reviews.filter(review => {
      return review.bathroomId === bathroom.id ? review : "";
    });
    console.log(bathroomReviews, "reviews");

    // console.log(bathroom, 'bathroom vv');
    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            //will connect data-image to source field below here
            source={{ uri: Images.Restroom }}
            style={styles.profileContainer}
            imageStyle={styles.profileImage}
          >
            <Block flex style={styles.profileDetails}>
              <Block style={styles.profileTexts}>
                <Block style={styles.backButton}>
                  <Icon
                    raised
                    reverse
                    name="close"
                    type="material"
                    color="black"
                    onPress={() => backButton()}
                  />
                </Block>
                <Text color="white" size={28} style={{ paddingBottom: 36 }}>
                  {bathroom.establishment}{" "}
                </Text>
                <Block row space="between">
                  <Block row>
                    <Block middle style={styles.pro}>
                      <Text size={16} color="black">
                        Pro
                      </Text>
                    </Block>
                    <Text color="white" size={16} muted style={styles.seller}>
                      Establishment
                    </Text>
                    <Text size={16} color={materialTheme.COLORS.WARNING}>
                      4.9{" "}
                    </Text>
                  </Block>
                  <Block>
                    <Text color={theme.COLORS.MUTED} size={16}>
                      {` `} {bathroom.city} {' '} 
                    </Text>
                  </Block>
                </Block>
              </Block>
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
                style={styles.gradient}
              />
            </Block>
          </ImageBackground>
        </Block>
        <Block flex style={styles.options}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Block row space="between" style={{ padding: theme.SIZES.BASE }}>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 8 }}>
                  {bathroomReviews.length}
                </Text>
                <Text muted size={12}>
                  Reviews
                </Text>
              </Block>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 8 }}>
                  {bathroom.AvgRating || 0}
                </Text>
                <Text muted size={12}>
                  Avg Rating
                </Text>
              </Block>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 8 }}>
                  2
                </Text>
                <Text muted size={12}>
                  Add Review
                </Text>
              </Block>
            </Block>
            <Block
              row
              space="between"
              style={{ paddingVertical: 16, alignItems: "baseline" }}
            >
              <Text size={16}>Recent Reviews</Text>

              <Text
                size={12}
                color={theme.COLORS.GRADIENT_END}
                // onPress={() => this.props.navigation.navigate("Home")}
              >
                Tweet
              </Text>
            </Block>
            <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
              <Block row space="between" style={{ flexWrap: "wrap" }}>
                
                <Text size={16}>"This place is the absolute best"</Text>
                <Text size={16}>
                  "Spacious stalls everywhere and it smells nice"
                </Text>
                <Text size={16}>
                  "Theres mouth wash and they have mints too!"
                </Text>
                <Text size={16}>"I might just move in here!"</Text>
              </Block>
            </Block>
          </ScrollView>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    marginBottom: -HeaderHeight * 2
  },
  profileImage: {
    width: width * 1.1,
    height: "auto"
  },
  profileContainer: {
    width: width,
    height: height / 2
  },
  profileDetails: {
    paddingTop: theme.SIZES.BASE * 4,
    justifyContent: "flex-end",
    position: "relative"
  },
  profileTexts: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
    zIndex: 2
  },
  pro: {
    backgroundColor: materialTheme.COLORS.ACTIVE,
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    borderRadius: 4,
    height: 19,
    width: 38
  },
  seller: {
    marginRight: theme.SIZES.BASE / 2
  },
  options: {
    position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: -theme.SIZES.BASE * 7,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: "30%",
    position: "absolute"
  },
  backButton: {
    alignSelf: "flex-end",
    marginTop: 20,
    position: "absolute",
    opacity: 0.7
  }
});

const mapStateToProps = ({ bathrooms, reviews }) => ({ bathrooms, reviews });

export default connect(mapStateToProps, null)(BathroomView);