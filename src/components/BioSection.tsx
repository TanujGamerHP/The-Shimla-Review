'use client'

import { useState } from 'react'

export default function BioSection({ bio }: { bio?: string | null }) {
  return (
    <div className="mb-8 w-full text-left">
      <div className="text-[13px] text-gray-800 leading-relaxed">
        {bio ? (
          <p className="whitespace-pre-wrap">{bio}</p>
        ) : (
          <>
            <p className="mb-3">
              Sandeep Sharma is Asst Prof of Comparative Literature at Government College, Solan (HP), India. He is Associate Editor of the journals In Translation (Université Badji Moktar de Annaba) and Traduction et Langues (University of Oran 2).
            </p>
            <p className="mb-3">
              He read his research papers in Derrida Today conference at the Goldsmiths University, London; the First International Applied Linguistics Conference (IALC) organised by L’université Kasdi Merbah Ouargla, Algeria and in the World Semiotic Conference at the University of Macerata, Italy .
            </p>
            <p>
              He received the Award of Academic Excellence (2022) by the Arab Translators’ Association for his contribution to research and linguistics. He has published his works with SIL International (US);The Yellow Medicine Review (Southwest Minnesota State University); PoetryXHunger (Maryland State Arts Council, US); Impspired (UK); The Ekphrastic Review; Southwest Word Fiesta (Silver City, New Mexico); Lothlorien Poetry Journal (US); The Anguillian (Anguilla); In Translation (Algeria), HP University (India) and so on. His book on Translation Studies is made available as a reference book in the universities of Africa, Ukraine and India.<br />
              <strong>Supervisors:</strong> Prof Ernst R. Wendland (Stellenbosch University, South Africa) and Prof V P Sharma (Department of English, Himachal Pradesh University, and India)
            </p>
          </>
        )}
      </div>
    </div>
  )
}
