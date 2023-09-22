import { IconContext } from "react-icons";
import { AiOutlinePlus } from "react-icons/ai";
import Router from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import { Note } from "@/types/Note";
import { GetServerSideProps } from "next";
import { AiFillClockCircle, AiFillEdit, AiFillDelete } from "react-icons/ai";

export default function Home({ serverNotes }: { serverNotes: Note[] }) {
    const [notes, setNotes] = useState<Note[]>(serverNotes);

    function handleNoteClicked(note: Note) {
        Router.push(`/note?id=${note.id}&view`);
    }

    function handleNoteEditButtonClicked(note: Note) {
        Router.push(`/note?id=${note.id}`);
    }

    function handleNoteDeleteButtonClicked(note: Note) {
        axios.delete(`http://localhost:8800/${note.id}`);
        setNotes(notes.filter((fnote) => fnote.id != note.id));
    }

    return (
        <main className="p-6 flex flex-col gap-4 h-full dark:bg-slate-800">
            <center>
                <h1 className="text-4xl font-semibold text-slate-700 dark:text-slate-500">
                    Your Notes
                </h1>
            </center>
            <hr className="dark:border-slate-700 border-2" />
            <div className="grid grid-cols-10 grid-rows-4 h-full gap-6">
                <button
                    onClick={() => Router.push("/note")}
                    className="group bg-slate-200 dark:bg-slate-600 h-full w-full flex items-center justify-center rounded-lg hover:bg-blue-400 dark:hover:bg-blue-400 transition-colors duration-300"
                >
                    <AiOutlinePlus
                        size={60}
                        className="text-slate-400 dark:text-slate-500 group-hover:text-white transition-colors duration-300"
                    />
                </button>
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className="group bg-slate-200 dark:bg-slate-600 h-full w-full flex flex-col items-center rounded-lg transition-colors duration-300 hover:bg-slate-300 hover:dark:bg-slate-700 hover:outline-dashed outline-4 outline-slate-200 dark:outline-slate-700"
                    >
                        <button
                            onClick={() => handleNoteClicked(note)}
                            className="w-full h-5/6"
                        >
                            <div className="w-full h-1/3 dark:bg-slate-700 bg-slate-300 from-blue-600 to-purple-600 group-hover:bg-gradient-to-b rounded-lg p-2 flex flex-col justify-center z-10">
                                <h1 className="italic group-hover:text-white dark:text-white">
                                    {note.title}
                                </h1>
                                <div className="flex w-full justify-center items-center gap-1 text-black group-hover:text-slate-300 dark:text-slate-400">
                                    <AiFillClockCircle className="text-slate-700 dark:text-slate-300 group-hover:text-white" />
                                    {note.creation_date}
                                </div>
                            </div>
                            <p className="p-2 w-full h-2/3 dark:text-slate-200 transition-colors duration-300 rounded-lg overflow-hidden relative before:content-[' '] before:w-full before:h-full before:absolute before:left-0 before:top-0 before:bg-gradient-to-b before:from-transparent before:to-slate-200 before:dark:to-slate-600">
                                {note.contents}
                            </p>
                        </button>
                        <div className="flex justify-center items-center w-full h-1/6">
                            <button
                                onClick={() =>
                                    handleNoteEditButtonClicked(note)
                                }
                                className="w-1/2 flex justify-center p-2 cursor-pointer group/edit"
                            >
                                <AiFillEdit className="text-orange-400 text-2xl group-hover/edit:text-black group-hover/edit:dark:text-white" />
                            </button>
                            <button
                                onClick={() =>
                                    handleNoteDeleteButtonClicked(note)
                                }
                                className="w-1/2 flex justify-center p-2 cursor-pointer group/delete"
                            >
                                <AiFillDelete className="text-red-400 text-2xl group-hover/delete:text-black group-hover/delete:dark:text-white" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export const getServerSideProps = (async (ctx) => {
    const res = await axios.get("http://localhost:8800");
    const notes = await res.data;
    return { props: { serverNotes: notes } };
}) satisfies GetServerSideProps<{
    serverNotes: Note[];
}>;
