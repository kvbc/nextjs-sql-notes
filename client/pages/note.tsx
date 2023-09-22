import { Note } from "@/types/Note";
import axios from "axios";
import Router, { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import { PiKeyReturnFill } from "react-icons/pi";

export default function NoteView() {
    const router = useRouter();
    const [title, setTitle] = useState<string>("");
    const [contents, setContents] = useState<string>("");
    const [note, setNote] = useState<Note | null>(null);

    let noteID: number | null = null;
    let isNoteViewOnly = router.query.view !== undefined;
    {
        let qID = router.query.id;
        if (typeof qID === "string") noteID = Number(qID);
    }
    useEffect(() => {
        if (noteID != null)
            axios
                .get(`http://localhost:8800/${noteID}`)
                .then((res) => setNote(res.data))
                .catch((err) => {
                    throw new Error(err);
                });
    }, [noteID]);

    useEffect(() => {
        if (note != null) {
            setTitle(note.title ?? "");
            setContents(note.contents);
        }
    }, [note]);

    function handleBackButtonClicked() {
        Router.push("/");
    }

    const handleAddOrEditButtonClicked = useCallback(() => {
        if (!isNoteViewOnly) {
            let url = "http://localhost:8800/";
            if (note != null) url += note.id;
            axios
                .post(url, {
                    title,
                    contents,
                })
                .then(() => {
                    Router.push("/");
                })
                .catch((err) => {
                    throw new Error(err);
                });
        } else Router.push("/");
    }, [contents, isNoteViewOnly, note, title]);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key == "Escape" || (e.shiftKey && e.key == "Backspace"))
                Router.push("/");
            else if (e.shiftKey && e.key == "Enter")
                handleAddOrEditButtonClicked();
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [handleAddOrEditButtonClicked]);

    return (
        <main className="p-6 flex flex-col gap-4 h-full dark:bg-slate-800">
            <div className="flex gap-4 items-center">
                <h1 className="font-semibold text-4xl dark:text-slate-500">
                    {isNoteViewOnly
                        ? "Note"
                        : note === null
                        ? "New Note"
                        : "Edit Note"}
                </h1>
                <button
                    onClick={handleBackButtonClicked}
                    className="text-slate-400 text-3xl flex items-center gap-2"
                >
                    <PiKeyReturnFill />
                </button>
            </div>
            <hr className="dark:border-slate-700 border-2" />
            <div className="flex gap-4 items-center">
                <text className="w-16 dark:text-slate-500">Title </text>
                <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    className="bg-slate-200 dark:bg-slate-700 dark:text-white rounded-lg p-2"
                    type="text"
                    readOnly={isNoteViewOnly}
                />
            </div>
            <div className="flex gap-4 h-1/2">
                <text className="w-16 dark:text-slate-500">Contents </text>
                <textarea
                    onChange={(e) => setContents(e.target.value)}
                    value={contents}
                    className="bg-slate-200 dark:bg-slate-700 dark:text-white rounded-lg p-2 resize-none w-1/3 h-full"
                    readOnly={isNoteViewOnly}
                />
            </div>
            {!isNoteViewOnly && (
                <button
                    onClick={handleAddOrEditButtonClicked}
                    className="bg-blue-500 rounded-lg p-2 text-white w-40 text-xl ml-20"
                >
                    {note === null ? "Add Note" : "Edit Note"}
                </button>
            )}
        </main>
    );
}
