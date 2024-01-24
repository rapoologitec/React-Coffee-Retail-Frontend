import React from 'react' 
import Modal from 'react-bootstrap/Modal'

// Haven't test it yet
// https://react-bootstrap.github.io/components/modal/  

export default function Confirmation(props){
    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Place Your Order Now?</h4>
            <p>
              You can change your mind within 10 minutes
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide} variant="outline-info">Cancel</Button>
            <Button onClick={props.onConfirm} variant="danger">Submit</Button> 
          </Modal.Footer>
        </Modal>
      );
}


/*
Example driver code, replace it with submit order?

function App() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Launch vertically centered modal
      </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onConfirm={alert('confirmed!')} // for debug
      />
    </>
  );
*/