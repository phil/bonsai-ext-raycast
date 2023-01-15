import { 
  Form, 
  ActionPanel, 
  Action, 
  Detail,
  closeMainWindow, 
  PopToRootType, 
  showToast,
  getPreferenceValues,
} from "@raycast/api";
import { useState, useEffect } from "react"
import axios from "axios"

import { Preferences } from "./types/preferences"

type Book = {
  id: string
  created_at: string,
  updated_at: string,
  user_id: string,
  default: boolean,
  name: string,
  slug: string,
  colour: string,
  archived_at: string
}

export default function Command() {

  let [isLoading, setIsLoading] = useState(false)
  let [books, setBooks] = useState<Array<Book>>([])
  let [selectedBook, setSelectedBook] = useState<Book>(null)
  let [noteBody, setNoteBody] = useState("")

  const preferences = getPreferenceValues<Preferences>();

  useEffect(() => {
    axios.get(
      "https://bonsai-notes.com/api/v1/books.json",
      {
        headers: {
          "Content-Type": "application/json",
          "AUTHORIZATION": `Bearer ${preferences["api-key"]}`
        }
      })
      .then(function (response) {
        setBooks(response.data)
      })
      .catch(function (error) {
        // handle error
        console.log("Error getting books")
        console.log(error);
      })
  }, [])

  // async function handleSubmit(values: Values) {
  async function handleSubmit() {
    console.log(`submitting: Book(${selectedBook}) Note(${noteBody})`)
    axios.post(
      `https://bonsai-notes.com/api/v1/books/${selectedBook.id}/notes.json`,
      {
        note: {
          body: noteBody
        }
      },
      {
        headers: {
            "Content-Type": "application/json",
            "AUTHORIZATION": `Bearer ${preferences["api-key"]}`
        }
      }
    ).then((response) => {
      showToast({ title: "Note Created", message: `Note successfully created in ${selectedBook.name}` })
      setTimeout(() => {
        closeMainWindow({ clearRootSearch: true, popToRootType: PopToRootType.Immediate });
      }, 1000)
    })
  }

  return(
    <Form
      isLoading={isLoading}
        actions={
          <ActionPanel>
            <Action.SubmitForm onSubmit={handleSubmit} />
          </ActionPanel>
        }
        >
          <Form.Description text="Select you Book, then write your note." />
          <Form.Dropdown id="book" title="Book" placeholder="Search for Book" onChange={(event) => { setSelectedBook(books.find((book) => { return book.name === event } ))}} >
            { books.map((book) => {
              return <Form.Dropdown.Item value={book.name} title={book.name} key={book.id} />
            })}
          </Form.Dropdown>

          <Form.TextArea id="note" title="Note" placeholder="..." onChange={setNoteBody} />
        </Form>
    )
}
