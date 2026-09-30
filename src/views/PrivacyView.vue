<script setup lang="ts">
import LegalPage from '@/components/layout/LegalPage.vue'
import LegalLanguageSwitch from '@/components/shared/LegalLanguageSwitch.vue'
import OperatorAddress from '@/components/shared/OperatorAddress.vue'
import { useLegalLanguage } from '@/legal'

const language = useLegalLanguage()
</script>

<template>
  <LegalPage
    :title="language === 'de' ? 'Datenschutzerklärung' : 'Privacy policy'"
    :contents-label="language === 'de' ? 'Inhalt' : 'Contents'"
    :lang="language"
    :content-key="language"
  >
    <template #band>
      <LegalLanguageSwitch v-model="language" />
    </template>

    <template v-if="language === 'de'">
      <section id="kurzfassung">
        <h2><span class="number">1</span><span class="title">Das Wichtigste in Kürze</span></h2>
        <ul>
          <li>
            Ihre Dateien verlassen niemals Ihr Gerät. Die Komprimierung findet vollständig in Ihrem
            Browser statt, es werden keine Bilder oder PDFs an einen Server hochgeladen.
          </li>
          <li>Es gibt keine Cookies, kein Tracking, keine Analyse-Tools und keine Werbung.</li>
          <li>
            Personenbezogene Daten (z. B. Ihre IP-Adresse) werden nur verarbeitet, soweit dies
            technisch notwendig ist, um Ihnen die Website auszuliefern und den Zähler der
            komprimierten Dateien anzuzeigen.
          </li>
        </ul>
      </section>

      <section id="verantwortlicher">
        <h2><span class="number">2</span><span class="title">Verantwortlicher</span></h2>
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der
          Datenschutz-Grundverordnung (DSGVO) ist:
        </p>
        <OperatorAddress email-label="E-Mail:" />
      </section>

      <section id="komprimierung">
        <h2><span class="number">3</span><span class="title">Komprimierung Ihrer Dateien</span></h2>
        <p>
          Die von Ihnen ausgewählten Bilder (JPG, PNG, WEBP, SVG) und PDF-Dateien werden
          ausschließlich lokal in Ihrem Browser mithilfe von JavaScript und WebAssembly komprimiert.
          Die Dateien, deren Inhalte und Dateinamen werden weder an mich noch an Dritte übermittelt
          und auch nicht gespeichert. Ich habe keinen Zugriff auf Ihre Dateien. Sobald Sie die Seite
          schließen oder neu laden, sind die Dateien aus dem Arbeitsspeicher Ihres Browsers
          entfernt.
        </p>
      </section>

      <section id="hosting">
        <h2>
          <span class="number">4</span
          ><span class="title">Hosting und Bereitstellung der Website</span>
        </h2>
        <p>
          Diese Website wird bei Cloudflare Pages gehostet. Anbieter ist die Cloudflare, Inc., 101
          Townsend St, San Francisco, CA 94107, USA („Cloudflare“). Cloudflare betreibt ein
          weltweites Netz von Rechenzentren (Content Delivery Network), über das die Website
          ausgeliefert und vor Angriffen geschützt wird.
        </p>
        <p>
          Beim Aufruf der Website verarbeitet Cloudflare zwangsläufig Daten, die Ihr Browser
          automatisch übermittelt. Das sind insbesondere Ihre IP-Adresse, Datum und Uhrzeit des
          Zugriffs, die aufgerufene Adresse (URL), die Referrer-URL, der übertragene Datenumfang,
          der HTTP-Statuscode sowie Browsertyp und -version und Betriebssystem (User-Agent). Diese
          Daten sind erforderlich, um Ihnen die Website technisch auszuliefern, die Stabilität und
          Sicherheit des Angebots zu gewährleisten und Missbrauch (z. B. DDoS-Angriffe) abzuwehren.
          Ich selbst werte diese Daten nicht aus und führe sie nicht mit anderen Datenquellen
          zusammen.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt in einer
          sicheren, schnellen und zuverlässigen Bereitstellung der Website.
        </p>
        <p>
          Mit Cloudflare besteht ein Vertrag über Auftragsverarbeitung gemäß Art. 28 DSGVO. Dabei
          kann es auch zu einer Übermittlung von Daten in die USA kommen. Cloudflare ist unter dem
          EU-U.S. Data Privacy Framework zertifiziert, sodass die Übermittlung auf Grundlage des
          Angemessenheitsbeschlusses der Europäischen Kommission (Art. 45 DSGVO) erfolgt; zusätzlich
          hat Cloudflare Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO) abgeschlossen.
          Weitere Informationen finden Sie in der
          <a href="https://www.cloudflare.com/de-de/privacypolicy/" target="_blank" rel="noopener"
            >Datenschutzerklärung von Cloudflare</a
          >.
        </p>
      </section>

      <section id="zaehler">
        <h2>
          <span class="number">5</span><span class="title">Zähler der komprimierten Dateien</span>
        </h2>
        <p>
          Auf der Startseite wird angezeigt, wie viele Dateien mit Shrink Me insgesamt komprimiert
          und wie viele Bytes dabei eingespart wurden. Dazu baut Ihr Browser eine Verbindung
          (WebSocket) zu einem Cloudflare Worker unter derselben Domain (shrinkme.app/api/counter)
          auf, über den er den aktuellen Stand erhält. Nach einer Komprimierung übermittelt Ihr
          Browser lediglich die Anzahl der komprimierten Dateien und die Summe der eingesparten
          Bytes. Dateien, Dateinamen oder sonstige Inhalte werden dabei nicht übermittelt. Der
          Gesamtzähler selbst enthält keine personenbezogenen Daten.
        </p>
        <p>
          Beim Verbindungsaufbau werden technisch bedingt die in Abschnitt 4 genannten
          Verbindungsdaten (insbesondere Ihre IP-Adresse) von Cloudflare verarbeitet. Zur
          Fehleranalyse werden technische Protokolle der Aufrufe dieses Workers (z. B. Zeitpunkt,
          angefragte URL, Statuscode) für höchstens 7 Tage gespeichert und anschließend automatisch
          gelöscht.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse besteht darin,
          die Nutzung von Shrink Me in anonymer, zusammengefasster Form darzustellen.
        </p>
      </section>

      <section id="endgeraet">
        <h2>
          <span class="number">6</span><span class="title">Speicherung auf Ihrem Endgerät</span>
        </h2>
        <p>
          Diese Website verwendet keine Cookies. Folgende Daten werden in Ihrem Browser abgelegt:
        </p>
        <ul>
          <li>
            <strong>Service Worker und Cache-Speicher:</strong> Damit Shrink Me auch offline und
            schneller funktioniert, werden die Dateien der Website (HTML, JavaScript, Styles,
            Schriftarten, Bilder) über einen Service Worker im Cache Ihres Browsers gespeichert.
          </li>
          <li>
            <strong>Local Storage („counter-snapshot“):</strong> Der zuletzt empfangene Stand des
            Zählers wird gespeichert, damit er beim nächsten Besuch sofort angezeigt werden kann. Er
            enthält nur die zwei Gesamtwerte und keine Daten über Sie.
          </li>
        </ul>
        <p>
          Diese Speicherung ist unbedingt erforderlich, um den von Ihnen ausdrücklich gewünschten
          Dienst (einschließlich der Offline-Nutzung) bereitzustellen. Rechtsgrundlage ist § 25 Abs.
          2 Nr. 2 TDDDG; eine Einwilligung ist daher nicht erforderlich. Soweit dabei
          personenbezogene Daten betroffen sein sollten, ist Rechtsgrundlage Art. 6 Abs. 1 lit. f
          DSGVO. Die Daten werden nicht an mich übertragen. Sie können sie jederzeit über die
          Einstellungen Ihres Browsers löschen („Websitedaten löschen“).
        </p>
      </section>

      <section id="kontakt">
        <h2><span class="number">7</span><span class="title">Kontakt per E-Mail</span></h2>
        <p>
          Wenn Sie mir eine E-Mail schreiben, verarbeite ich Ihre E-Mail-Adresse, Ihren Namen
          (sofern angegeben), den Inhalt Ihrer Nachricht sowie Datum und Uhrzeit, um Ihre Anfrage zu
          beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; mein berechtigtes Interesse
          liegt in der Beantwortung Ihrer Anfrage. Die Daten werden gelöscht, sobald Ihre Anfrage
          abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
          Zum Empfang und zur Speicherung von E-Mails setze ich einen E-Mail-Anbieter als
          Auftragsverarbeiter ein.
        </p>
      </section>

      <section id="links">
        <h2><span class="number">8</span><span class="title">Externe Links</span></h2>
        <p>
          Diese Website enthält Links zu externen Websites (z. B. GitHub, Unsplash, Flaticon). Beim
          bloßen Aufruf von Shrink Me werden keine Daten an diese Anbieter übertragen. Erst wenn Sie
          einen Link anklicken, verlassen Sie diese Website, und es gilt die Datenschutzerklärung
          des jeweiligen Anbieters. Schriftarten, Bilder und Symbole werden lokal von dieser Website
          geladen, nicht von Servern Dritter.
        </p>
      </section>

      <section id="rechte">
        <h2><span class="number">9</span><span class="title">Ihre Rechte</span></h2>
        <p>
          Sie haben gegenüber mir hinsichtlich der Sie betreffenden personenbezogenen Daten folgende
          Rechte:
        </p>
        <ul>
          <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
          <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
          <li>Recht auf Löschung (Art. 17 DSGVO)</li>
          <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
        </ul>
        <p>
          Zur Ausübung Ihrer Rechte genügt eine formlose Nachricht an die oben genannte
          E-Mail-Adresse.
        </p>
        <p>
          Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die
          Verarbeitung Ihrer personenbezogenen Daten zu beschweren (Art. 77 DSGVO), insbesondere in
          dem Mitgliedstaat Ihres gewöhnlichen Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts
          des mutmaßlichen Verstoßes.
        </p>
        <div class="callout">
          <h3>Widerspruchsrecht (Art. 21 DSGVO)</h3>
          <p>
            Soweit ich Ihre Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
            Interesse) verarbeite, haben Sie das Recht, aus Gründen, die sich aus Ihrer besonderen
            Situation ergeben, jederzeit Widerspruch gegen diese Verarbeitung einzulegen. Ich
            verarbeite Ihre Daten dann nicht mehr, es sei denn, ich kann zwingende schutzwürdige
            Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und Freiheiten
            überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung
            von Rechtsansprüchen.
          </p>
        </div>
      </section>

      <section id="weiteres">
        <h2><span class="number">10</span><span class="title">Weitere Hinweise</span></h2>
        <p>
          Die Bereitstellung Ihrer Daten ist weder gesetzlich noch vertraglich vorgeschrieben. Ohne
          die in Abschnitt 4 genannten Verbindungsdaten kann die Website jedoch technisch nicht
          ausgeliefert werden. Eine automatisierte Entscheidungsfindung einschließlich Profiling
          (Art. 22 DSGVO) findet nicht statt.
        </p>
        <p>
          Ich passe diese Datenschutzerklärung an, sobald sich die Website oder die Rechtslage
          ändert. Es gilt die jeweils hier veröffentlichte Fassung.
        </p>
      </section>
    </template>

    <template v-else>
      <p class="note">
        This is a courtesy translation of the German “Datenschutzerklärung”. In case of doubt, the
        German version prevails.
      </p>

      <section id="summary">
        <h2><span class="number">1</span><span class="title">The short version</span></h2>
        <ul>
          <li>
            Your files never leave your device. Compression happens entirely in your browser, no
            images or PDFs are uploaded to any server.
          </li>
          <li>There are no cookies, no tracking, no analytics and no ads.</li>
          <li>
            Personal data (such as your IP address) is only processed as far as technically
            necessary to deliver the website to you and to show the counter of compressed files.
          </li>
        </ul>
      </section>

      <section id="controller">
        <h2><span class="number">2</span><span class="title">Controller</span></h2>
        <p>
          The controller responsible for data processing on this website within the meaning of the
          General Data Protection Regulation (GDPR) is:
        </p>
        <OperatorAddress email-label="Email:" />
      </section>

      <section id="compression">
        <h2><span class="number">3</span><span class="title">Compressing your files</span></h2>
        <p>
          The images (JPG, PNG, WEBP, SVG) and PDF files you select are compressed exclusively
          locally in your browser using JavaScript and WebAssembly. The files, their content and
          their file names are neither transmitted to me or to any third party nor stored. I have no
          access to your files. As soon as you close or reload the page, they are removed from your
          browser's memory.
        </p>
      </section>

      <section id="hosting">
        <h2>
          <span class="number">4</span
          ><span class="title">Hosting and delivery of the website</span>
        </h2>
        <p>
          This website is hosted on Cloudflare Pages. The provider is Cloudflare, Inc., 101 Townsend
          St, San Francisco, CA 94107, USA (“Cloudflare”). Cloudflare operates a worldwide network
          of data centers (content delivery network) that delivers this website and protects it
          against attacks.
        </p>
        <p>
          When you visit the website, Cloudflare necessarily processes data that your browser sends
          automatically, in particular your IP address, the date and time of access, the requested
          address (URL), the referrer URL, the amount of data transferred, the HTTP status code as
          well as your browser type and version and operating system (user agent). This data is
          required to technically deliver the website, to ensure its stability and security and to
          fend off abuse (e.g. DDoS attacks). I do not analyze this data myself and do not combine
          it with other data sources.
        </p>
        <p>
          The legal basis is Art. 6 (1) (f) GDPR. My legitimate interest lies in delivering the
          website securely, quickly and reliably.
        </p>
        <p>
          A data processing agreement pursuant to Art. 28 GDPR is in place with Cloudflare. Data may
          also be transferred to the USA. Cloudflare is certified under the EU-U.S. Data Privacy
          Framework, so the transfer is based on the European Commission's adequacy decision (Art.
          45 GDPR); in addition, Cloudflare has concluded standard contractual clauses (Art. 46 (2)
          (c) GDPR). You can find more information in
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener"
            >Cloudflare's privacy policy</a
          >.
        </p>
      </section>

      <section id="counter">
        <h2><span class="number">5</span><span class="title">Counter of compressed files</span></h2>
        <p>
          The home page shows how many files have been compressed with Shrink Me in total and how
          many bytes were saved. To do so, your browser opens a connection (WebSocket) to a
          Cloudflare Worker on the same domain (shrinkme.app/api/counter) to receive the current
          totals. After a compression, your browser only sends the number of compressed files and
          the total number of bytes saved. No files, file names or other content are transmitted.
          The global counter itself contains no personal data.
        </p>
        <p>
          When the connection is established, Cloudflare necessarily processes the connection data
          listed in section 4 (in particular your IP address). For troubleshooting, technical logs
          of requests to this Worker (e.g. time, requested URL, status code) are kept for at most 7
          days and then deleted automatically.
        </p>
        <p>
          The legal basis is Art. 6 (1) (f) GDPR. My legitimate interest is to show the usage of
          Shrink Me in an anonymous, aggregated form.
        </p>
      </section>

      <section id="device-storage">
        <h2><span class="number">6</span><span class="title">Storage on your device</span></h2>
        <p>This website does not use cookies. The following data is stored in your browser:</p>
        <ul>
          <li>
            <strong>Service worker and cache storage:</strong> To make Shrink Me work offline and
            load faster, the website's files (HTML, JavaScript, styles, fonts, images) are stored in
            your browser's cache by a service worker.
          </li>
          <li>
            <strong>Local storage (“counter-snapshot”):</strong> The last received counter value is
            stored so that it can be shown immediately on your next visit. It only contains the two
            totals and no data about you.
          </li>
        </ul>
        <p>
          This storage is strictly necessary to provide the service you explicitly requested
          (including offline use). The legal basis is § 25 (2) no. 2 of the German
          Telecommunications Digital Services Data Protection Act (TDDDG), so no consent is
          required. Insofar as personal data should be affected, the legal basis is Art. 6 (1) (f)
          GDPR. The data is not transmitted to me. You can delete it at any time in your browser's
          settings (“clear site data”).
        </p>
      </section>

      <section id="contact">
        <h2><span class="number">7</span><span class="title">Contact by email</span></h2>
        <p>
          If you send me an email, I process your email address, your name (if provided), the
          content of your message and the date and time in order to answer your request. The legal
          basis is Art. 6 (1) (f) GDPR; my legitimate interest lies in answering your request. The
          data is deleted once your request has been fully dealt with, unless statutory retention
          obligations apply. I use an email provider as a processor to receive and store emails.
        </p>
      </section>

      <section id="external-links">
        <h2><span class="number">8</span><span class="title">External links</span></h2>
        <p>
          This website contains links to external websites (e.g. GitHub, Unsplash, Flaticon). Simply
          visiting Shrink Me does not transmit any data to these providers. Only when you click a
          link do you leave this website, and the privacy policy of the respective provider applies.
          Fonts, images and icons are loaded locally from this website, not from third-party
          servers.
        </p>
      </section>

      <section id="rights">
        <h2><span class="number">9</span><span class="title">Your rights</span></h2>
        <p>With regard to your personal data, you have the following rights:</p>
        <ul>
          <li>Right of access (Art. 15 GDPR)</li>
          <li>Right to rectification (Art. 16 GDPR)</li>
          <li>Right to erasure (Art. 17 GDPR)</li>
          <li>Right to restriction of processing (Art. 18 GDPR)</li>
          <li>Right to data portability (Art. 20 GDPR)</li>
        </ul>
        <p>
          To exercise your rights, an informal message to the email address above is sufficient.
        </p>
        <p>
          You also have the right to lodge a complaint with a data protection supervisory authority
          about the processing of your personal data (Art. 77 GDPR), in particular in the Member
          State of your habitual residence, place of work or place of the alleged infringement.
        </p>
        <div class="callout">
          <h3>Right to object (Art. 21 GDPR)</h3>
          <p>
            Where I process your data on the basis of Art. 6 (1) (f) GDPR (legitimate interest), you
            have the right to object to this processing at any time on grounds relating to your
            particular situation. I will then no longer process your data unless I can demonstrate
            compelling legitimate grounds for the processing which override your interests, rights
            and freedoms, or the processing serves the establishment, exercise or defense of legal
            claims.
          </p>
        </div>
      </section>

      <section id="further-information">
        <h2><span class="number">10</span><span class="title">Further information</span></h2>
        <p>
          You are neither legally nor contractually obliged to provide your data. Without the
          connection data listed in section 4, however, the website cannot be delivered. No
          automated decision-making, including profiling (Art. 22 GDPR), takes place.
        </p>
        <p>
          I will update this privacy policy whenever the website or the legal situation changes. The
          version published here applies.
        </p>
      </section>
    </template>
  </LegalPage>
</template>
