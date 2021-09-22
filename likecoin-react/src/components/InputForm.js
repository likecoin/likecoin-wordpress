import { useRef } from 'react';

function InputForm(props) {
    const likerIdRef = useRef();
    function submitHandler(event) {
        event.preventDefault();
        const likerId = likerIdRef.current.value;
        const data = { likerId: likerId };
      // props.onAddInput -> onAddInput -> postDataToWordpress and execute below.
      props.onAddInput(data);
    }
  
  return (
    <form onSubmit={submitHandler}>
      <label>Input Your Liker ID</label>
      <input type="text" required id="likerId" ref={likerIdRef} />
      <button>Submit</button>
    </form>
  );
}

export default InputForm;