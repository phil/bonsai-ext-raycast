import { 
  Form, 
  ActionPanel, 
  Action, 
  Detail,
  closeMainWindow, 
  PopToRootType, 
  showToast,
  getPreferenceValues,
  openCommandPreferences
} from "@raycast/api";
import { useState, useEffect } from "react"
import { setTimeout } from "timers/promises";

type Values = {
  // textfield: string;
  // textarea: string;
  // datepicker: Date;
  // checkbox: boolean;
  // dropdown: string;
  // tokeneditor: string[];

};


// interface State {
//   items?: [];
//   error?: Error;
// }


interface Preferences {
  apiKey: string
  // name: string;
  // bodyWeight?: string;
  // bodyHeight?: string;
}

export default function Command() {

  // const { pop } = useNavigation();
  let [books, setBooks] = useState<Array<string>>([])
  let [note, setNote] = useState<string>("")


  useEffect(() => {
    const apiKey = getPreferenceValues<Preferences>().apiKey
    setBooks([
      "Personal",
      "Work"
    ])
  }, [])

  async function handleSubmit(values: Values) {
    console.log(values)
    showToast({ title: "Submitted form", message: "See logs for submitted values" })
    await setTimeout(1000);
    await closeMainWindow({ clearRootSearch: true, popToRootType: PopToRootType.Immediate });
  }

  return (
    // <Form
    //   actions={
    //     <ActionPanel>
    //       <Action.SubmitForm onSubmit={handleSubmit} />
    //     </ActionPanel>
    //   }
    // >
    <Detail
      markdown="API key incorrect. Please update it in command preferences and try again."
      actions={
        <ActionPanel>
          <Action title="Open Extension Preferences" onAction={openCommandPreferences} />
        </ActionPanel>
      }
    />
      // <Form.Description text="This form showcases all available form elements." />

      // <Form.Dropdown id="book" title="Book" placeholder="Search for Book" defaultValue="Raycast">
      //   { books.map((book) => {
      //     return <Form.Dropdown.Item value={book} title={book} />
      //   })}
      // </Form.Dropdown>

      // <Form.TextArea id="note" title="Note" placeholder="..." />
    // </Form>
  );
}
