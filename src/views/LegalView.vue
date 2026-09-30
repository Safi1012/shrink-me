<script setup lang="ts">
import LegalPage from '@/components/layout/LegalPage.vue'
import LegalLanguageSwitch from '@/components/shared/LegalLanguageSwitch.vue'
import OperatorAddress from '@/components/shared/OperatorAddress.vue'
import { useLegalLanguage } from '@/legal'

const language = useLegalLanguage()
</script>

<template>
  <LegalPage
    :title="language === 'de' ? 'Impressum' : 'Legal notice'"
    :contents-label="language === 'de' ? 'Inhalt' : 'Contents'"
    :lang="language"
    :content-key="language"
  >
    <template #band>
      <LegalLanguageSwitch v-model="language" />
    </template>

    <template v-if="language === 'de'">
      <section id="anbieter">
        <h2>Angaben gemäß § 5 DDG</h2>
        <OperatorAddress email-label="E-Mail:" />
      </section>

      <section id="haftung-inhalte">
        <h2>Haftung für Inhalte</h2>
        <p>
          Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
          Vollständigkeit und Aktualität der Inhalte kann ich jedoch keine Gewähr übernehmen. Als
          Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den
          allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG bin ich als Diensteanbieter
          jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
          hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach
          den allgemeinen Gesetzen bleiben hiervon unberührt. Sobald mir eine konkrete
          Rechtsverletzung bekannt wird, entferne ich den betreffenden Inhalt umgehend.
        </p>
      </section>

      <section id="haftung-links">
        <h2>Haftung für Links</h2>
        <p>
          Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen
          Einfluss habe. Für diese fremden Inhalte ist stets der jeweilige Anbieter oder Betreiber
          der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
          mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren zu diesem Zeitpunkt nicht
          erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete
          Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
          Rechtsverletzungen entferne ich derartige Links umgehend.
        </p>
      </section>

      <section id="urheberrecht">
        <h2>Urheberrecht</h2>
        <p>
          Die Texte und Grafiken dieser Website unterliegen dem deutschen Urheberrecht. Der
          Quellcode von Shrink Me ist unter der
          <a
            href="https://github.com/Safi1012/shrink-me/blob/main/LICENSE"
            target="_blank"
            rel="noopener"
            >MIT-Lizenz</a
          >
          veröffentlicht. Inhalte Dritter (Bilder, Symbole, Schriftarten und Open-Source-Software)
          sind als solche gekennzeichnet und unterliegen den auf der Seite
          <router-link to="/credits">Credits</router-link> genannten Lizenzen. Sollten Sie trotzdem
          auf eine Urheberrechtsverletzung aufmerksam werden, bitte ich um einen entsprechenden
          Hinweis. Bei Bekanntwerden von Rechtsverletzungen entferne ich derartige Inhalte umgehend.
        </p>
      </section>
    </template>

    <template v-else>
      <p class="note">
        This is a courtesy translation of the German “Impressum”. Only the German version is legally
        binding.
      </p>

      <section id="provider">
        <h2>Information pursuant to § 5 DDG (German Digital Services Act)</h2>
        <OperatorAddress email-label="Email:" />
      </section>

      <section id="liability-content">
        <h2>Liability for content</h2>
        <p>
          The content of this website has been created with the greatest possible care. However, I
          cannot guarantee that it is correct, complete or up to date. As a service provider, I am
          responsible for my own content on these pages under general law in accordance with § 7 (1)
          DDG. According to §§ 8 to 10 DDG, however, I am not obliged to monitor transmitted or
          stored third-party information or to investigate circumstances that indicate illegal
          activity. Obligations to remove or block the use of information under general law remain
          unaffected. As soon as I become aware of a specific infringement, I will remove the
          content in question immediately.
        </p>
      </section>

      <section id="liability-links">
        <h2>Liability for links</h2>
        <p>
          This website contains links to external third-party websites whose content I have no
          influence over. The respective provider or operator of those pages is always responsible
          for their content. The linked pages were checked for possible legal violations at the time
          of linking, and no illegal content was apparent at that time. Permanent monitoring of the
          linked pages is not reasonable without concrete evidence of an infringement. If I become
          aware of any infringements, I will remove such links immediately.
        </p>
      </section>

      <section id="copyright">
        <h2>Copyright</h2>
        <p>
          The texts and graphics on this website are subject to German copyright law. The source
          code of Shrink Me is published under the
          <a
            href="https://github.com/Safi1012/shrink-me/blob/main/LICENSE"
            target="_blank"
            rel="noopener"
            >MIT License</a
          >. Third-party content (images, icons, fonts and open source software) is marked as such
          and is subject to the licenses listed on the
          <router-link to="/credits">Credits</router-link> page. Should you nevertheless become
          aware of a copyright infringement, please let me know. If I become aware of any
          infringements, I will remove such content immediately.
        </p>
      </section>
    </template>
  </LegalPage>
</template>
