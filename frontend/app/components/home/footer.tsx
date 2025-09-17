import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <Link href="/imprint">
                            <span className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                Imprint
                            </span>
                        </Link>
                        <Link href="/privacypolicy">
                            <span className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                Privacy Policy
                            </span>
                        </Link>
                        <Link href="/tos">
                            <span className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                Terms of Service
                            </span>
                        </Link>
                    </div>
                    <p className="text-sm text-gray-500">
                        &copy; {currentYear} Ideafinder. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
