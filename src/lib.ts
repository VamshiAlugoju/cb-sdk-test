export const getReceiverId = (userId: string): string | null => {
    const parts = userId.split('@');
    if (parts.length !== 3) return null;

    const [userType, merchant, uniqueId] = parts;

    switch (userType) {
        case 'customer':
            return `agent@${merchant}@${uniqueId}`;
        case 'agent':
            return `customer@${merchant}@${uniqueId}`;
        default:
            return null;
    }
};


export const isValidUserId = (userId: string) => {
    const parts = userId.split('@');
    if (parts.length !== 3) return false;
    const [userType, merchant, uniqueId] = parts;
    return userType === 'customer' || userType === 'agent';
}


export type TextTranslationParams = {
    text: string;
    targetLang: string;
    apiKey: string;
}

export const translateText = async (input: TextTranslationParams): Promise<string | null> => {
    const payload = {
        text: input.text,
        tgt_lang: input.targetLang,
        src_lang: "eng",
    }
    try {
        const res = await fetch(`http://10.10.0.203:8000/translate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
        const data = await res.json();
        return data?.translation || null
    } catch (error) {
        return null
    }
}