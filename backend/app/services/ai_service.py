from app.services.knowledge_service import get_relevant_knowledge


def contains_any(text: str, keywords: list[str]) -> bool:
    return any(keyword in text for keyword in keywords)


def get_ai_response(message: str) -> str:
    text = message.lower()
    get_relevant_knowledge(message)

    if contains_any(text, ["pain", "swelling", "bleeding", "trauma", "fever", "emergency"]):
        return (
            "I can share general information, but urgent dental symptoms should "
            "be handled by clinic staff or urgent care. If you have severe pain, "
            "swelling, bleeding, fever, or dental trauma, please contact the "
            "clinic directly as soon as possible."
        )

    if "braces" in text:
        return (
            "Braces Consultation\n\n"
            "This is for patients who want to discuss teeth alignment, braces, "
            "or orthodontic treatment options."
        )

    if contains_any(text, ["whitening", "whiten"]):
        return (
            "Teeth Whitening\n\n"
            "This is for patients interested in improving tooth shade with a "
            "professional whitening consultation."
        )

    if "implant" in text:
        return (
            "Dental Implant Consultation\n\n"
            "This is for patients who want to discuss options for replacing a "
            "missing tooth."
        )

    if contains_any(text, ["service", "services", "offer", "available", "treatment"]):
        return (
            "Available services:\n\n"
            "1. Dental Consultation\n"
            "2. Braces Consultation\n"
            "3. Teeth Whitening\n"
            "4. Dental Implant Consultation\n"
            "5. Child Dental Appointment"
        )

    if contains_any(text, ["child", "children", "kid", "kids", "baby"]):
        return (
            "The clinic can support children with checkups, preventive care, "
            "dental pain concerns, and oral hygiene guidance. Would you like to "
            "request a child dental appointment?"
        )

    if contains_any(text, ["book", "booking", "appointment", "visit", "schedule"]):
        return (
            "You can request an appointment by sharing your name, phone number, "
            "service needed, preferred date, and preferred time. The clinic can "
            "then review and confirm the request."
        )

    if contains_any(text, ["hour", "hours", "open", "close", "time"]):
        return (
            "The current placeholder hours are Monday to Friday, 9:00 AM to "
            "5:00 PM; Saturday, 10:00 AM to 2:00 PM; and Sunday closed. These "
            "should be replaced with the clinic's confirmed hours before launch."
        )

    if contains_any(text, ["location", "address", "where", "direction"]):
        return (
            "The clinic location is still a placeholder in the knowledge base. "
            "Before deployment, add the exact address, landmark, city, and country."
        )

    if contains_any(text, ["price", "cost", "fee", "fees", "payment", "insurance"]):
        return (
            "Pricing and payment details should be confirmed by the clinic. I can "
            "share approved pricing notes once they are added to the knowledge base."
        )

    if contains_any(text, ["doctor", "dentist", "dentists", "specialist"]):
        return (
            "Dentist or doctor profiles can be added to the knowledge base. Once "
            "added, I can help patients learn which provider or appointment type "
            "may be relevant."
        )

    return (
        "I can help with clinic questions, dental services, appointment requests, "
        "opening hours, location, and when to contact clinic staff. What would "
        "you like to know?"
    )
