

export default function Footer() {
    return (
        <>
          <footer className="flex justify-center items-center gap-6 text-white/80 text-sm pb-8">
            <a href="/imprint" className="hover:text-white transition-colors duration-200">
              Imprint
            </a>
            <span className="text-white/40">|</span>
            <a href="privacypolicy" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <span className="text-white/40">|</span>
            <a href="tos" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
          </footer>
        </>
    )
}