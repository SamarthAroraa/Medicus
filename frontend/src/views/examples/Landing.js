/*!

=========================================================

*/
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
// nodejs library that concatenates classes
import classnames from "classnames";

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardImg,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  CardHeader,
} from "reactstrap";
import Resizer from "react-image-file-resizer";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import CardsFooter from "components/Footers/CardsFooter.js";

// index page sections
import Download from "../IndexSections/Download.js";

const Compress = require("compress.js");
const compress = new Compress();

const Landing = (props) => {
  const main = useRef(0);
  const hiddenFileInput = useRef(null);
  const [uploadedImg, setUploadedImg] = useState(null);
  const [actualFile, setActualFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    prediction_key: "",
    enum_val: -1,
    conf: "",
  });
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult({
      prediction_key: "",
      enum_val: -1,
      conf: "",
    });
    var formData = new FormData();
    if (actualFile) {
      formData.append("xray", actualFile);
      axios
        .post(process.env.REACT_APP_API_URI, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
          setResult(res.data);
        });
    }
  };
  const handleChange = async (event) => {
    setActualFile(event.target.files[0]);
    var fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        100,
        100,
        "JPEG",
        100,
        0,
        (uri) => {
          let imageurl = URL.createObjectURL(uri);
          setUploadedImg(imageurl);
          console.log(imageurl);
        },
        "blob",
        200,
        200
      );
    }
  };
  

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, []);

  return (
    <>
      <DemoNavbar />
      <main ref={main}>
        <div className="position-relative">
          {/* shape Hero */}
          <section className="section section-lg section-shaped pb-250">
            <div className="shape shape-style-1 shape-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <Container className="py-lg-md d-flex">
              <div className="col px-0">
                <Row>
                  <Col lg="6" className="mb-5">
                    <h1 className="display-3 text-white">
                      Your very own diagnostic tool{" "}
                    </h1>
                    <p className="lead text-white">
                      Just upload a picture of a Chest X-ray to get a diagnosis
                      from our highly accurate Deep Learning Model
                    </p>
                    <p className="lead text-white">Medicus gives you a diagnosis which classifies your X-ray into either 
                      a <strong>"Normal"</strong> category or a <strong>"Pneumonia"</strong> category
                    </p>
                    <div className="btn-wrapper">
                      <Button
                        className="btn-icon mb-3 mb-sm-0"
                        color="info"
                        onClick={handleSubmit}
                        href="#"
                      >
                        <span className="btn-inner--icon mr-1">
                          <i className="ni ni-sound-wave" />
                        </span>
                        <span className="btn-inner--text">Get Analysis</span>
                      </Button>
                      <Button
                        className="btn-white btn-icon mb-3 mb-sm-0 ml-1"
                        color="default"
                        onClick={handleClick}
                        type="file"
                      >
                        <span className="btn-inner--icon mr-1">
                          <i className="ni ni-cloud-upload-96" />
                        </span>
                        <span className="btn-inner--text">Upload an X-ray</span>
                      </Button>
                      <input
                        type="file"
                        ref={hiddenFileInput}
                        onChange={handleChange}
                        accept="image/jpeg"
                        style={{ display: "none" }}
                      />
                    </div>
                  </Col>
                  <Col lg="6">
                    <Card className=" shadow border-0">
                      {uploadedImg ? (
                        <CardImg
                          top
                          className="mx-auto mt-2"
                          style={{ maxWidth: "95%", maxHeight: "300px" }}
                          src={uploadedImg}
                          alt="X-ray"
                        />
                      ) : null}

                      {result.enum_val == 1 ? (
                        <CardHeader>
                          <div>
                            <Badge color="danger" pill className="mr-1">
                              Pneumonia
                            </Badge>
                          </div>
                        </CardHeader>
                      ) : null}
                      {result.enum_val == 0 ? (
                        <CardHeader>
                          <div>
                            <Badge color="success" pill className="mr-1">
                              Normal
                            </Badge>
                          </div>
                        </CardHeader>
                      ) : null}

                      <CardBody className="py-5">
                        {/* <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                          <i className="ni ni-check-bold" />
                        </div> */}
                        <h6 className="text-primary text-uppercase">
                          <i className="fas fa-notes-medical"></i> Your X-ray
                          Report
                        </h6>
                        <p className="description mt-3">
                          {result.prediction_key}
                        </p>
                        {result.prediction_key != "" ? (
                          <p className="description mt-3">
                            Model Confidence: {(result.conf * 100).toFixed(2)} %
                          </p>
                        ) : null}
                        {loading ? (
                          <p className="px-auto">
                            <div
                              class="spinner-border text-primary "
                              role="status"
                            >
                              <span class="sr-only">Loading...</span>
                            </div>
                          </p>
                        ) : null}

                        {/* <Button
                          className="mt-4"
                          color="primary"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          Learn more
                        </Button> */}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Container>
            {/* SVG separator */}
            <div className="separator separator-bottom separator-skew">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
          {/* 1st Hero Variation */}
        </div>
      </main>
    </>
  );
};

export default Landing;
