export default function Imprint() {

  // FIXME: update for prod
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-white">Legal Notice</h1>

        <p className="text-gray-300 mb-6 leading-relaxed">Muster GbR<br />
        Muster Street 111<br />
        Building 44<br />
        90210 Muster City</p>

        <p className="text-gray-300 mb-8 leading-relaxed"><strong className="text-white">Represented by:</strong><br />
        Dr. Harry Mustermann<br />
        Luise Beispiel</p>

        <h2 className="text-2xl font-semibold mb-4 text-white">Contact</h2>
        <p className="text-gray-300 mb-8 leading-relaxed">Phone: +49 (0) 123 44 55 66<br />
        Fax: +49 (0) 123 44 55 99<br />
        E-mail: mustermann@musterfirma.de</p>

        <h2 className="text-2xl font-semibold mb-4 text-white">Consumer Dispute Resolution / Universal Arbitration Body</h2>
        <p className="text-gray-300 mb-6 leading-relaxed">We are neither willing nor obligated to participate in dispute resolution proceedings before a consumer arbitration board.</p>

        <p className="text-gray-400 text-sm">Source: <a href="https://www.e-recht24.de" className="text-[#7A1CAC] hover:text-[#AD49E1] transition-colors duration-200 underline">eRecht24</a></p>
      </div>
    </div>
  )
}
