import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function TestingCredentials() {
    const [copied, setCopied] = useState<string | null>(null);

    const credentials = [
        { label: "Host Email", value: "o@h.com" },
        { label: "User Email", value: "o@d.com" },
        { label: "Password", value: "12345678" },
    ];

    const handleCopy = (value: string) => {
        navigator.clipboard.writeText(value);
        setCopied(value);
        setTimeout(() => setCopied(null), 1500);
    };

    return (
        <div className="bg-sec text-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
            <h4 className="text-lg font-semibold mb-4">🧪 Testing Credentials</h4>
            <ul className="space-y-3">
                {credentials.map((cred) => (
                    <li
                        key={cred.label}
                        className="flex items-center justify-between bg-white text-txt rounded px-4 py-2"
                    >
                        <span>
                            <strong>{cred.label}:</strong> {cred.value}
                        </span>
                        <button
                            onClick={() => handleCopy(cred.value)}
                            className="text-pri hover:text-acc transition"
                            title="Copy"
                        >
                            {copied === cred.value ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
