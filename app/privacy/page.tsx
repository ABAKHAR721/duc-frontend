// /app/politique-de-confidentialite/page.tsx
import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header/Header';
import MobileBottomNav from '@/components/Header/MobileBottomNav';
import { Footer } from '@/components/footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-gray-50">
        <Header variant="solid" />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

        {/* --- Header Section --- */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-800 tracking-tight sm:text-5xl">
            Mentions Légales & Confidentialité
          </h1>
          <p className="mt-4 text-md text-gray-500">
            Dernière mise à jour : 2 Octobre 2025
          </p>
        </div>

        {/* --- Legal Content Section --- */}
        {/* La classe "prose" formate automatiquement tout le contenu textuel 
            pour une lisibilité parfaite (titres, paragraphes, liens...). */}
        <div className="prose prose-lg max-w-none text-gray-600">
          
          <h2>1. Présentation du site</h2>
          <p>
            En vertu de l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique, il est précisé aux utilisateurs du site <Link href="/">www.pizzapodensac.com</Link> l’identité des différents intervenants dans le cadre de sa réalisation et de son suivi :
          </p>
          
          <h3 className="!mt-4 !mb-2 text-base font-semibold">Informations éditeur :</h3>
          <p>
            Nicolas Duchemann<br/>
            267 Rue Truchon, 33140 Cadaujac, France<br/>
            Email : <a href="mailto:nicolasduchemann33@gmail.com">nicolasduchemann33@gmail.com</a><br/>
            N° SIRET : 910 991 215 00013
          </p>

          <p>
            <strong>Créateur :</strong> Nicolas Duchemann<br/>
            <strong>Responsable publication :</strong> Nicolas Duchemann<br/>
            <strong>Webmaster :</strong> Nicolas Duchemann
          </p>

          <h3 className="!mt-4 !mb-2 text-base font-semibold">Hébergement :</h3>
          <p>
            OVH<br/>
            Siège social : 2 rue Kellermann – 59100 Roubaix – France<br/>
            Tel: 1007<br/>
            Site Web : <a href="http://www.ovh.com" target="_blank" rel="noopener noreferrer">www.ovh.com</a>
          </p>
          <br/>

          <h2>2. Conditions générales d’utilisation du site et des services proposés</h2>
          <p>
            L’utilisation du site <Link href="/">www.pizzapodensac.com</Link> implique l’acceptation pleine et entière des conditions générales d’utilisation ci-après décrites. Ces conditions d’utilisation sont susceptibles d’être modifiées ou complétées à tout moment, les utilisateurs du site sont donc invités à les consulter de manière régulière.
          </p>
          <p>
            Ce site est normalement accessible à tout moment aux utilisateurs. Une interruption pour raison de maintenance technique peut être toutefois décidée par <Link href="/">www.pizzapodensac.com</Link>, qui s’efforcera alors de communiquer préalablement aux utilisateurs les dates et heures de l’intervention.
          </p>
          <p>
            Le site est mis à jour régulièrement par Nicolas Duchemann. De la même façon, les mentions légales peuvent être modifiées à tout moment : elles s’imposent néanmoins à l’utilisateur qui est invité à s’y référer le plus souvent possible afin d’en prendre connaissance.
          </p>
          <br/>

          <h2>3. Description des services fournis</h2>
          <p>
            Le site <Link href="/">www.pizzapodensac.com</Link> a pour objet de fournir une information concernant l’ensemble des activités de la société. Nicolas Duchemann s’efforce de fournir sur le site des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu’elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
          </p>
          <p>
            Tous les informations indiquées sur le site sont données à titre indicatif, et sont susceptibles d’évoluer. Par ailleurs, les renseignements figurant sur le site ne sont pas exhaustifs. Ils sont donnés sous réserve de modifications ayant été apportées depuis leur mise en ligne.
          </p>
          <br/>

          <h2>4. Limitations contractuelles sur les données techniques</h2>
          <p>
            Le site utilise la technologie JavaScript. Le site Internet ne pourra être tenu responsable de dommages matériels liés à l’utilisation du site. De plus, l’utilisateur du site s’engage à accéder au site en utilisant un matériel récent, ne contenant pas de virus et avec un navigateur de dernière génération mis-à-jour.
          </p>
          <br/>

          <h2>5. Propriété intellectuelle et contrefaçons</h2>
          <p>
            Nicolas Duchemann est propriétaire des droits de propriété intellectuelle ou détient les droits d’usage sur tous les éléments accessibles sur le site, notamment les textes, images, graphismes, logo, icônes. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Nicolas Duchemann.
          </p>
          <p>
            Toute exploitation non autorisée du site ou de quelconque élément qu’il contient sera considérée comme constitutive d’une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
          </p>
          <br/>

          <h2>6. Limitations de responsabilité</h2>
          <p>
            Nicolas Duchemann ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l’utilisateur, lors de l’accès au site. Des espaces interactifs (possibilité de poser des questions dans l’espace contact) sont à la disposition des utilisateurs. Nicolas Duchemann se réserve le droit de supprimer, sans mise en demeure préalable, tout contenu déposé dans cet espace qui contreviendrait à la législation applicable en France, en particulier aux dispositions relatives à la protection des données. Le cas échéant, Nicolas Duchemann se réserve également la possibilité de mettre en cause la responsabilité civile et/ou pénale de l’utilisateur, notamment en cas de message à caractère raciste, injurieux, diffamant, ou pornographique.
          </p>
          <br/>
          <h2>7. Gestion des données personnelles</h2>
          <p>
            En France, les données personnelles sont notamment protégées par la loi n° 78-87 du 6 janvier 1978 et le RGPD. À l’occasion de l’utilisation du site, peuvent être recueillies : l’URL des liens, le fournisseur d’accès et l’adresse IP. Nicolas Duchemann ne collecte des informations personnelles que pour le besoin de certains services proposés. L’utilisateur fournit ces informations en toute connaissance de cause.
          </p>
          <p>
            Conformément à la loi « informatique et libertés », tout utilisateur dispose d’un droit d’accès, de rectification et d’opposition aux données personnelles le concernant, en effectuant sa demande écrite et signée, accompagnée d’une copie du titre d’identité.
          </p>
          <p>
            Aucune information personnelle n’est publiée, échangée, transférée, cédée ou vendue sur un support quelconque à des tiers. Le site n’est pas déclaré à la CNIL car il ne recueille pas d’informations personnelles sensibles.
          </p>
          <br/>

          <h2>8. Liens hypertextes et cookies</h2>
          <p>
            Le site contient un certain nombre de liens hypertextes vers d’autres sites. Nicolas Duchemann n’a pas la possibilité de vérifier le contenu des sites ainsi visités, et n’assumera en conséquence aucune responsabilité de ce fait. La navigation sur le site est susceptible de provoquer l’installation de cookie(s) sur l’ordinateur de l’utilisateur. Un cookie est un fichier de petite taille visant à faciliter la navigation et permettre diverses mesures de fréquentation. Le refus d’installation d’un cookie peut entraîner l’impossibilité d’accéder à certains services.
          </p>
          <br/>
          <h2>9. Droit applicable et attribution de juridiction</h2>
          <p>
            Tout litige en relation avec l’utilisation du site est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.
          </p>
          <br/>

          <h2>10. Les principales lois concernées</h2>
          <p>
            Loi n° 78-87 du 6 janvier 1978, notamment modifiée par la loi n° 2004-801 du 6 août 2004 relative à l’informatique, aux fichiers et aux libertés. Loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique.
          </p>
          <br/>

          <h2>11. Lexique</h2>
          <p>
            <strong>Utilisateur :</strong> Internaute se connectant, utilisant le site susnommé.
          </p>
          <p>
            <strong>Informations personnelles :</strong> « les informations qui permettent, sous quelque forme que ce soit, directement ou non, l’identification des personnes physiques auxquelles elles s’appliquent » (article 4 de la loi n° 78-17 du 6 janvier 1978).
          </p>
          <br/>

        </div>
        <MobileBottomNav />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;