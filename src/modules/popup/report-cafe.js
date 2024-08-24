"use state"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Popup from "@/components/popup"
import { Flag, ShieldExclamation, Shop, User, CommentCheck } from "../icons"
import Button from "@/components/button"

export default function ReportCafePopup({ cafeId, userId }) {
    const supabase = createClient()

    const [reportType, setReportType] = useState("") // "owner" or "user"
    const [description, setDescription] = useState("") // Additional information about the report
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hovered, setHovered] = useState(false)

    const handleReportSubmit = async () => {
        const isValid = validateForm()
        if (!isValid) {
            return
        }

        if (!reportType) {
            setErrorMessage("Please select a report type.");
            return
        }

        setIsSubmitting(true)
        setErrorMessage("")
        setSuccessMessage("")

        const { error } = await supabase
            .from("cafe_reports")
            .insert({
                cafe_id: cafeId,
                user_id: userId,
                report_type: reportType,
                description: description || null,
            });

        if (error) {
            setErrorMessage("There was an error submitting your report.");
        } else {
            setSuccessMessage("Thank you! Your report has been submitted.");
        }

        setIsSubmitting(false);
    }

    function validateForm() {
        // event.preventDefault();

        const content = document.getElementById('content').value

        // Validar que el campo de contenido tenga al menos 10 caracteres
        if (content.length < 10) {
            setErrorMessage('Content must be at least 20 characters long.')
            return false
        }

        console.log('Form validated successfully!')
        setErrorMessage(null)
        return true
    }

    return (
        <Popup trigger={
            <button
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="flex items-center gap-2"
            >
                <Flag size="20" color={hovered ? "#CC7843" : "#6B6F7B"} />
                <span className={`underline ${hovered ? "text-brand" : "text-gray"}`}>Report cafe</span>
            </button>
        } content={
            successMessage ? (
                <div className="p-5 flex flex-col items-center justify-center text-center gap-4">
                    <CommentCheck size="52" color="#CC7843" />
                    <h2 className="text-xl font-bold text-brand">
                        {successMessage}
                    </h2>
                </div>
            ) : (
                <div className="p-5 flex flex-col items-center gap-4">
                    <div className="items-center justify-center">
                        <ShieldExclamation size="52" color="#CC7843" />
                    </div >
                    <h2 className="text-xl font-bold">Report this Cafe</h2>
                    <div className="">
                        <label className="text-gray block">Please select from which perspective you want to report this cafeteria</label>
                        <div className="w-full flex justify-between items-center gap-5 mt-4">
                            <button
                                onClick={() => setReportType("owner")}
                                className={`h-full w-full py-5 flex flex-col gap-2 items-center justify-center 
                            border border-gray rounded-lg hover:bg-lightgray 
                            ${reportType === "owner" ? "text-brand border-brand" : "text-gray"}
                            
                            `}>

                                <Shop size="32" color={reportType === "owner" ? "#CC7843" : "#6B6F7B"} />

                                I'm Coffee Maker

                            </button>
                            <button
                                onClick={() => setReportType("user")}
                                className={`h-full w-full py-5 flex flex-col gap-2 items-center justify-center 
                            border border-gray rounded-lg hover:bg-lightgray 
                            ${reportType === "user" ? "text-brand border-brand" : "text-gray"}
                            
                            `}>

                                <User size="32" color={reportType === "user" ? "#CC7843" : "#6B6F7B"} />

                                I'm User

                            </button>
                        </div>
                    </div>
                    <div className="w-full mt-4">
                        <label className="block text-gray">Description:</label>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            name="content"
                            id="content"
                            minLength={1}
                            maxLength={350}
                            rows={3}
                            wrap="hard"
                            className={`
                        ${errorMessage
                                    ? "border-2 border-red-500 bg-red-200 focus:outline-none"
                                    : "focus:outline-none focus:ring-2 focus:ring-brand"}
                        bg-lightbrand rounded-lg p-4 resize-y min-h-[100px] max-h-[205px] overflow-hidden
                        w-full mt-2
                    `}
                            placeholder="Write a review..."
                        />
                    </div>
                    <button

                    >

                    </button>
                    <Button
                        className="w-full"
                        onClick={handleReportSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                </div >
            )
        } />
    );
}
