import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// These imports are now handled directly in this file for reliability.
import jsPDF from 'jspdf';
import { marked } from 'marked';
// import { Analytics } from '@vercel/analytics/react';
import * as Tone from 'tone';
import './App.css';



// --- EULA and Privacy Policy Content (Embedded as String Constants) ---
// NOTE: The 'eulaContent' constant now holds the Terms and Conditions.
const eulaContent = `
# Terms and Conditions

**Last updated:** August 27, 2025

Please read these terms and conditions carefully before using Our Service.

## Interpretation and Definitions

### Interpretation
The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.

### Definitions
For the purposes of these Terms and Conditions:

* **Application** means the software program provided by the Company downloaded by You on any electronic device, named FLASHFONIC.
* **Application Store** means the digital distribution service operated and developed by Apple Inc. (Apple App Store) or Google Inc. (Google Play Store) in which the Application has been downloaded.
* **Affiliate** means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.
* **Account** means a unique account created for You to access our Service or parts of our Service.
* **Country** refers to: Vermont, United States
* **Company** (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Trifecta Pro LLC, PO Box 265, Bennington VT 05201.
* **Content** refers to content such as text, images, or other information that can be posted, uploaded, linked to or otherwise made available by You, regardless of the form of that content.
* **Device** means any device that can access the Service such as a computer, a cellphone or a digital tablet.
* **Feedback** means feedback, innovations or suggestions sent by You regarding the attributes, performance or features of our Service.
* **Free Trial** refers to a limited period of time that may be free when purchasing a Subscription.
* **Promotions** refer to contests, sweepstakes or other promotions offered through the Service.
* **Service** refers to the Application or the Website or both.
* **Subscriptions** refer to the services or access to the Service offered on a subscription basis by the Company to You.
* **Terms and Conditions** (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.
* **Third-party Social Media Service** means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.
* **Website** refers to FLASHFONIC, accessible from www.flashfonic.com
* **You** means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.

## Acknowledgment
These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.
You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.
Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.

## Subscriptions

### Subscription period
The Service or some parts of the Service are available only with a paid Subscription. You will be billed in advance on a recurring and periodic basis (such as daily, weekly, monthly or annually), depending on the type of Subscription plan you select when purchasing the Subscription.
At the end of each period, Your Subscription will automatically renew under the exact same conditions unless You cancel it or the Company cancels it.

### Subscription cancellations
You may cancel Your Subscription renewal either through Your Account settings page or by contacting the Company. You will not receive a refund for the fees You already paid for Your current Subscription period and You will be able to access the Service until the end of Your current Subscription period.

### Billing
You shall provide the Company with accurate and complete billing information including full name, address, state, zip code, telephone number, and a valid payment method information.
Should automatic billing fail to occur for any reason, the Company will issue an electronic invoice indicating that you must proceed manually, within a certain deadline date, with the full payment corresponding to the billing period as indicated on the invoice.

### Fee Changes
The Company, in its sole discretion and at any time, may modify the Subscription fees. Any Subscription fee change will become effective at the end of the then-current Subscription period.
The Company will provide You with reasonable prior notice of any change in Subscription fees to give You an opportunity to terminate Your Subscription before such change becomes effective.
Your continued use of the Service after the Subscription fee change comes into effect constitutes Your agreement to pay the modified Subscription fee amount.

### Refunds
Except when required by law, paid Subscription fees are non-refundable.
Certain refund requests for Subscriptions may be considered by the Company on a case-by-case basis and granted at the sole discretion of the Company.

### Free Trial
The Company may, at its sole discretion, offer a Subscription with a Free Trial for a limited period of time.
You may be required to enter Your billing information in order to sign up for the Free Trial.
If You do enter Your billing information when signing up for a Free Trial, You will not be charged by the Company until the Free Trial has expired. On the last day of the Free Trial period, unless You canceled Your Subscription, You will be automatically charged the applicable Subscription fees for the type of Subscription You have selected.
At any time and without notice, the Company reserves the right to (i) modify the terms and conditions of the Free Trial offer, or (ii) cancel such Free Trial offer.

## Promotions
Any Promotions made available through the Service may be governed by rules that are separate from these Terms.
If You participate in any Promotions, please review the applicable rules as well as our Privacy policy. If the rules for a Promotion conflict with these Terms, the Promotion rules will apply.

## User Accounts
When You create an account with Us, You must provide Us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.
You are responsible for safeguarding the password that You use to access the Service and for any activities or actions under Your password, whether Your password is with Our Service or a Third-Party Social Media Service.
You agree not to disclose Your password to any third party. You must notify Us immediately upon becoming aware of any breach of security or unauthorized use of Your account.
You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than You without appropriate authorization, or a name that is otherwise offensive, vulgar or obscene.

## Content

### Your Right to Post Content
Our Service allows You to post Content. You are responsible for the Content that You post to the Service, including its legality, reliability, and appropriateness.
By posting Content to the Service, You grant Us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of Your rights to any Content You submit, post or display on or through the Service and You are responsible for protecting those rights. You agree that this license includes the right for Us to make Your Content available to other users of the Service, who may also use Your Content subject to these Terms.
You represent and warrant that: (i) the Content is Yours (You own it) or You have the right to use it and grant Us the rights and license as provided in these Terms, and (ii) the posting of Your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.

### Content Restrictions
The Company is not responsible for the content of the Service's users. You expressly understand and agree that You are solely responsible for the Content and for all activity that occurs under Your account, whether done so by You or any third person using Your account.
You may not transmit any Content that is unlawful, offensive, upsetting, intended to disgust, threatening, libelous, defamatory, obscene or otherwise objectionable. Examples of such objectionable Content include, but are not limited to, the following:

* Unlawful or promoting unlawful activity.
* Defamatory, discriminatory, or mean-spirited content, including references or commentary about religion, race, sexual orientation, gender, national/ethnic origin, or other targeted groups.
* Spam, machine – or randomly – generated, constituting unauthorized or unsolicited advertising, chain letters, any other form of unauthorized solicitation, or any form of lottery or gambling.
* Containing or installing any viruses, worms, malware, trojan horses, or other content that is designed or intended to disrupt, damage, or limit the functioning of any software, hardware or telecommunications equipment or to damage or obtain unauthorized access to any data or other information of a third person.
* Infringing on any proprietary rights of any party, including patent, trademark, trade secret, copyright, right of publicity or other rights.
* Impersonating any person or entity including the Company and its employees or representatives.
* Violating the privacy of any third person.
* False information and features.

The Company reserves the right, but not the obligation, to, in its sole discretion, determine whether or not any Content is appropriate and complies with these Terms, refuse or remove this Content. The Company further reserves the right to make formatting and edits and change the manner of any Content. The Company can also limit or revoke the use of the Service if You post such objectionable Content. As the Company cannot control all content posted by users and/or third parties on the Service, you agree to use the Service at your own risk. You understand that by using the Service You may be exposed to content that You may find offensive, indecent, incorrect or objectionable, and You agree that under no circumstances will the Company be liable in any way for any content, including any errors or omissions in any content, or any loss or damage of any kind incurred as a result of your use of any content.

### Content Backups
Although regular backups of Content are performed, the Company does not guarantee there will be no loss or corruption of data.
Corrupt or invalid backup points may be caused by, without limitation, Content that is corrupted prior to being backed up or that changes during the time a backup is performed.
The Company will provide support and attempt to troubleshoot any known or discovered issues that may affect the backups of Content. But You acknowledge that the Company has no liability related to the integrity of Content or the failure to successfully restore Content to a usable state.
You agree to maintain a complete and accurate copy of any Content in a location independent of the Service.

## Copyright Policy

### Intellectual Property Infringement
We respect the intellectual property rights of others. It is Our policy to respond to any claim that Content posted on the Service infringes a copyright or other intellectual property infringement of any person.
If You are a copyright owner, or authorized on behalf of one, and You believe that the copyrighted work has been copied in a way that constitutes copyright infringement that is taking place through the Service, You must submit Your notice in writing to the attention of our copyright agent via email at dmca@flashfonic.com and include in Your notice a detailed description of the alleged infringement.
You may be held accountable for damages (including costs and attorneys' fees) for misrepresenting that any Content is infringing Your copyright.

### DMCA Notice and DMCA Procedure for Copyright Infringement Claims
You may submit a notification pursuant to the Digital Millennium Copyright Act (DMCA) by providing our Copyright Agent with the following information in writing (see 17 U.S.C 512(c)(3) for further detail):

* An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright's interest.
* A description of the copyrighted work that You claim has been infringed, including the URL (i.e., web page address) of the location where the copyrighted work exists or a copy of the copyrighted work.
* Identification of the URL or other specific location on the Service where the material that You claim is infringing is located.
* Your address, telephone number, and email address.
* A statement by You that You have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.
* A statement by You, made under penalty of perjury, that the above information in Your notice is accurate and that You are the copyright owner or authorized to act on the copyright owner's behalf.

You can contact our copyright agent via email at admin@trifectapro.com. Upon receipt of a notification, the Company will take whatever action, in its sole discretion, it deems appropriate, including removal of the challenged content from the Service.

## Intellectual Property
The Service and its original content (excluding Content provided by You or other users), features and functionality are and will remain the exclusive property of the Company and its licensors.
The Service is protected by copyright, trademark, and other laws of both the Country and foreign countries.
Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the Company.

## Your Feedback to Us
You assign all rights, title and interest in any Feedback You provide the Company. If for any reason such assignment is ineffective, You agree to grant the Company a non-exclusive, perpetual, irrevocable, royalty free, worldwide right and license to use, reproduce, disclose, sub-license, distribute, modify and exploit such Feedback without restriction.

## Links to Other Websites
Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.
The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.
We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.

## Termination
We may terminate or suspend Your Account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
Upon termination, Your right to use the Service will cease immediately. If You wish to terminate Your Account, You may simply discontinue using the Service.

## Limitation of Liability
Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.
To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.
Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law.

## "AS IS" and "AS AVAILABLE" Disclaimer
The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.
Without limiting the foregoing, neither the Company nor any of the company's provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.
Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law.

## Governing Law
The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.

## Disputes Resolution
If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.

### For European Union (EU) Users
If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which you are resident.

### United States Federal Government End Use Provisions
If You are a U.S. federal government end user, our Service is a "Commercial Item" as that term is defined at 48 C.F.R. §2.101.

### United States Legal Compliance
You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a "terrorist supporting" country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.

## Severability and Waiver

### Severability
If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.

### Waiver
Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not affect a party's ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.

## Translation Interpretation
These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.

## Changes to These Terms and Conditions
We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.
By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.

## Contact Us
If you have any questions about these Terms and Conditions, You can contact us:

* By email: feedbackflashfonic@gmail.com
`;


// ... (eulaContent constant should be above this)

const privacyPolicyContent = `
# Privacy Policy

**Last updated:** August 27, 2025

This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.

## Interpretation and Definitions

### Interpretation
The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.

### Definitions
For the purposes of this Privacy Policy:

* **Account** means a unique account created for You to access our Service or parts of our Service.
* **Affiliate** means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.
* **Application** refers to FLASHFONIC, the software program provided by the Company.
* **Business**, for the purpose of CCPA/CPRA, refers to the Company as the legal entity that collects Consumers' personal information and determines the purposes and means of the processing of Consumers' personal information...
* **CCPA and/or CPRA** refers to the California Consumer Privacy Act (the "CCPA") as amended by the California Privacy Rights Act of 2020 (the "CPRA").
* **Company** (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Trifecta Pro LLC, PO Box 265, Bennington VT 05201. For the purpose of the GDPR, the Company is the Data Controller.
* **Consumer**, for the purpose of the CCPA/CPRA, means a natural person who is a California resident...
* **Cookies** are small files that are placed on Your computer, mobile device or any other device by a website...
* **Country** refers to: Vermont, United States
* **Data Controller**, for the purposes of the GDPR, refers to the Company as the legal person which alone or jointly with others determines the purposes and means of the processing of Personal Data.
* **Device** means any device that can access the Service such as a computer, a cellphone or a digital tablet.
* **GDPR** refers to EU General Data Protection Regulation.
* **Personal Data** is any information that relates to an identified or identifiable individual.
* **Service** refers to the Application or the Website or both.
* **Service Provider** means any natural or legal person who processes the data on behalf of the Company...
* **Usage Data** refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself.
* **Website** refers to FLASHFONIC, accessible from www.flashfonic.com
* **You** means the individual accessing or using the Service... Under GDPR, You can be referred to as the Data Subject or as the User.

## Collecting and Using Your Personal Data

### Types of Data Collected

#### Personal Data
While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
* Email address
* First name and last name
* Address, State, Province, ZIP/Postal code, City
* Usage Data

#### Usage Data
Usage Data is collected automatically when using the Service. It may include information such as Your Device's IP address, browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, and other diagnostic data.

### Tracking Technologies and Cookies
We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. These technologies may include:

* **Cookies or Browser Cookies:** A small file placed on Your Device. You can instruct Your browser to refuse all Cookies.
* **Web Beacons:** Small electronic files known as web beacons that permit the Company to count users who have visited pages or opened an email.

We use both Session and Persistent Cookies for purposes such as:
* **Necessary / Essential Cookies (Session)**: To authenticate users and prevent fraudulent use.
* **Cookies Policy / Notice Acceptance Cookies (Persistent)**: To identify if users have accepted the use of cookies.
* **Functionality Cookies (Persistent)**: To remember choices You make, such as login details or language preference.
* **Tracking and Performance Cookies (Persistent)**: To track information about traffic and how users use the Website.

### Use of Your Personal Data
The Company may use Personal Data for the following purposes:
* To provide and maintain our Service.
* To manage Your Account.
* For the performance of a contract.
* To contact You with updates or informative communications.
* To provide You with news, special offers, and general information.
* To manage Your requests.
* To deliver targeted advertising to You.
* For business transfers, such as a merger or acquisition.
* For other purposes, such as data analysis and improving our Service.

We may share Your personal information in the following situations:
* With Service Providers to monitor and analyze the use of our Service.
* For business transfers.
* With Our affiliates.
* With business partners.
* With other users when you interact in public areas.
* With Your consent.

### Retention of Your Personal Data
The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy.

### Transfer of Your Personal Data
Your information, including Personal Data, is processed at the Company's operating offices. Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.

### Delete Your Personal Data
You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You. You may update, amend, or delete Your information at any time by signing in to Your Account.

### Disclosure of Your Personal Data
Your Personal Data may be disclosed for Business Transactions, in response to Law Enforcement requests, or to comply with other legal requirements.

### Security of Your Personal Data
The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.

## Detailed Information on the Processing of Your Personal Data
The Service Providers We use may have access to Your Personal Data.

* **Analytics:** We may use third-party Service providers like Google Analytics and Firebase.
* **Email Marketing:** We may use Email Marketing Service Providers like Mailchimp.
* **Payments:** We may use third-party payment processors like Stripe, Apple Store In-App Payments, and Google Play In-App Payments.
* **Behavioral Remarketing:** The Company uses remarketing services (e.g., Google Ads, Bing Ads, Twitter, Facebook) to advertise to You after You visit our Service.

## GDPR Privacy
### Legal Basis for Processing Personal Data under GDPR
We may process Personal Data under conditions such as Consent, Performance of a contract, Legal obligations, Vital interests, Public interests, and Legitimate interests.

### Your Rights under the GDPR
If You are within the EU, you have the right to:
* Request access to Your Personal Data.
* Request correction of Your Personal Data.
* Object to processing of Your Personal Data.
* Request erasure of Your Personal Data.
* Request the transfer of Your Personal Data.
* Withdraw Your consent.

### Exercising of Your GDPR Data Protection Rights
You may exercise Your rights by contacting Us. You also have the right to complain to a Data Protection Authority.

## CCPA/CPRA Privacy Notice (California Privacy Rights)
This section supplements the information in Our Privacy Policy and applies solely to California residents.

### Categories of Personal Information Collected
We may have collected the following categories of personal information within the last twelve (12) months:
* **Category A:** Identifiers. (Collected: Yes)
* **Category B:** Personal information categories listed in the California Customer Records statute. (Collected: Yes)
* **Category C:** Protected classification characteristics under California or federal law. (Collected: No)
* **Category D:** Commercial information. (Collected: Yes)
* **Category E:** Biometric information. (Collected: No)
* **Category F:** Internet or other similar network activity. (Collected: Yes)
* **Category G:** Geolocation data. (Collected: No)
* **Category H:** Sensory data. (Collected: No)
* **Category I:** Professional or employment-related information. (Collected: No)
* **Category J:** Non-public education information. (Collected: No)
* **Category K:** Inferences drawn from other personal information. (Collected: No)
* **Category L:** Sensitive personal information. (Collected: Yes)

### Your Rights under the CCPA/CPRA
If You are a resident of California, You have the right to notice, the right to know/access, the right to say no to the sale or sharing of Personal Data (opt-out), the right to correct, the right to limit use of sensitive Personal Data, the right to delete, and the right not to be discriminated against. To exercise any of these rights, please contact Us.

### Do Not Sell My Personal Information
You have the right to opt-out of the sale of Your personal information. To exercise Your right to opt-out, please contact Us or follow the instructions on our Service.

## Children's Privacy
Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13.

## Links to Other Websites
Our Service may contain links to other websites. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.

## Changes to this Privacy Policy
We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.

## Contact Us
If you have any questions about this Privacy Policy, You can contact us:
* By email: feedbackflashfonic@gmail.com
`;

// --- HELPER FUNCTIONS ---

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const floorSeconds = Math.floor(seconds);
    const min = Math.floor(floorSeconds / 60);
    const sec = floorSeconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

// --- MODAL AND UI COMPONENTS ---

const DocViewer = ({ docType, onClose }) => {
    const content = docType === 'eula' ? eulaContent : privacyPolicyContent;
    const title = docType === 'eula' ? 'Terms and Conditions' : 'Privacy Policy';

    return (
        <div className="viewer-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '800px', textAlign: 'left', padding: '2rem', overflowY: 'auto', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
                <div className="viewer-header" style={{ marginBottom: '1rem' }}>
                    <h2 className="how-to-play-title" style={{ textAlign: 'center', flexGrow: 1 }}>{title}</h2>
                    <button onClick={onClose} className="viewer-close-btn">&times;</button>
                </div>
                <div className="how-to-play-content" dangerouslySetInnerHTML={{ __html: marked(content) }} />
                <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                    <button onClick={onClose} className="modal-create-btn">Close</button>
                </div>
            </div>
        </div>
    );
};

const EULAModal = ({ onAccept }) => {
    return (
        <div className="viewer-overlay">
            <div className="modal-content" style={{ maxWidth: '800px', textAlign: 'left', padding: '2rem', overflowY: 'auto', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
                <h2 className="how-to-play-title" style={{textAlign: 'center'}}>Terms and Conditions</h2>
                <div className="how-to-play-content" dangerouslySetInnerHTML={{ __html: marked(eulaContent) }} />
                <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                    <button onClick={onAccept} className="modal-create-btn">I Agree</button>
                </div>
            </div>
        </div>
    );
};

const FlashFonicModeModal = ({ onSelect, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Choose Capture Mode</h2>
            <div className="modal-actions" style={{ flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={() => onSelect('live')} className="modal-create-btn">🔴 Live Capture</button>
                <button onClick={() => onSelect('upload')} className="modal-create-btn">⬆️ Audio/Video File Upload</button>
            </div>
        </div>
    </div>
);

const ImageSourceModal = ({ onSelect, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Select Image Source</h2>
            <div className="modal-actions" style={{ flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={() => onSelect('camera')} className="modal-create-btn">📷 Snap Photo Using Camera</button>
                <button onClick={() => onSelect('upload')} className="modal-create-btn">🖼️ Upload from Device</button>
            </div>
        </div>
    </div>
);


const LandingPage = ({ onEnter }) => {
    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="nav-logo">FlashFonic</div>
                <button onClick={onEnter} className="nav-cta">Enter Beta</button>
            </nav>

            <header className="landing-hero">
                <h1 className="landing-h1">The Future of Studying is Here.</h1>
                <p className="landing-p">
                    Introducing <span className="brand-bling">FlashFonic</span>, the world's first AI-powered learning companion that transforms your study materials into dynamic flashcards, organized notes, and engaging games.
                </p>
                <button onClick={onEnter} className="landing-cta">Start Flashing!</button>
            </header>

            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>CAPTURE</h3>
                        <p>Record live audio, upload a file, or snap a photo of your notes.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>AI GENERATE</h3>
                        <p>Our intelligent AI instantly creates Q&A flashcards or comprehensive notes.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>MASTER</h3>
                        <p>Solidify your knowledge with advanced study tools and fun, interactive games.</p>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <h2>Unleash Your Learning Superpowers.</h2>
                <div className="features-grid">
                    <div className="feature-card" style={{ border: '1px solid #EC4899', boxShadow: '0 0 15px rgba(236, 72, 153, 0.3)' }}>
                        <h3>📸 FlashFoto: Snap & Learn Instantly</h3>
                        <p>Transform your personal notes, diagrams, or whiteboard images\* into interactive flashcards. Just snap a photo, and our AI does the rest, extracting key information to create ready-to-study content.</p>
                        <p style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-dark)' }}>\*with permission</p>
                    </div>
                    <div className="feature-card" style={{ border: '1px solid #8B5CF6', boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' }}>
                        <h3>📝 FlashNotes: Your Personal AI Study Guide</h3>
                        <p>Turn your entire flashcard deck into a coherent, organized study guide with one click. FlashNotes synthesizes your Q&A pairs into comprehensive, markdown-formatted summaries, perfect for review sessions.</p>
                    </div>
                    <div className="feature-card" style={{ border: '1px solid #10B981', boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' }}>
                        <h3>🏆 Verbatim Master: Game Your Way to Recall</h3>
                        <p>Challenge your memory with our interactive recall game. Listen to questions and speak your answers aloud. Our AI scores your precision, helping you achieve true mastery and solidify long-term retention.</p>
                    </div>
                    <div className="feature-card" style={{ border: '1px solid #FFD700', boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)' }}>
                        <h3>✨ Smart Organization & Seamless Export</h3>
                        <p>Effortlessly manage your knowledge with intuitive folders and subfolders. Export your custom flashcards to PDF or CSV, or your FlashNotes to PDF, for offline study and sharing. Your learning, your way.</p>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <h2>Ready to experience the future of studying?</h2>
                <button onClick={onEnter} className="landing-cta">Start Flashing!</button>
                <p className="footer-credit">Welcome to the FlashFonic Beta</p>
            </footer>
        </div>
    );
};

const HowToPlayModal = ({ onClose }) => {
    return (
        <div className="modal-overlay how-to-play-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="how-to-play-title">How to Play: Verbatim Master</h2>
                <div className="how-to-play-content">
                    <p><strong>The Goal:</strong> Prove you're a master of recall! Your mission is to listen to the question and then speak the answer exactly as it appears on the flashcard.</p>
                    
                    <h3>Gameplay</h3>
                    <ol>
                        <li><strong>Listen Carefully:</strong> The AI will read a question from your deck aloud.</li>
                        <li><strong>Speak Clearly:</strong> After the question, the microphone will activate. Speak the answer clearly and precisely. The AI stops listening after a moment of silence.</li>
                        <li><strong>Get Scored:</strong> Our Verbatim Master AI will instantly score your answer based on how close it is to the correct one.</li>
                    </ol>

                    <h3>Scoring & Ranks</h3>
                    <p>Your final score is tallied and you're awarded a rank based on your performance:</p>
                    <ul>
                        <li><strong>Verbatim Master (100%):</strong> 🏆 Flawless recall!</li>
                        <li><strong>Synapse Slayer (90-99%):</strong> 🧠 A truly elite memory.</li>
                        <li><strong>Recall Assassin (80-89%):</strong> 🗡️ Sharp and deadly accurate.</li>
                        <li><strong>Mind Sniper (70-79%):</strong> 🎯 On target, but aim for perfection.</li>
                        <li><strong>Mnemonic Casualty (&lt;70%):</strong> 🩹 A valiant effort. Review and try again!</li>
                    </ul>
                    
                    <h3>The Benefit</h3>
                    <p>This isn't just a game; it's a powerful study tool. Recalling information verbatim strengthens neural pathways, dramatically improving your long-term memory and mastery of the subject.</p>
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="modal-create-btn">Got It!</button>
                </div>
            </div>
        </div>
    );
};

const EnterNameModal = ({ onClose, onConfirm }) => {
    const [name, setName] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onConfirm(name.trim());
        }
    };
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Enter Your Name</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="modal-input"
                        placeholder="Player Name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                    <div className="modal-actions">
                        <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="modal-create-btn">Let's Go!</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const GamesModal = ({ folder, onClose, onLaunchGame, onLaunchAnamnesisNemesis }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content games-modal-content" onClick={e => e.stopPropagation()}>
                <h2>Games for "{folder.name}"</h2>
                <p className="modal-message">Choose a game mode to test your knowledge!</p>
                <div className="game-selection-grid">
                    <button onClick={() => onLaunchGame(folder)}>Verbatim Master AI</button>
                    <button onClick={() => onLaunchAnamnesisNemesis(folder)}>Anamnesis Nemesis</button>
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="modal-cancel-btn">Close</button>
                </div>
            </div>
        </div>
    );
};

const ExamFolderSelectionModal = ({ allFolders, selectedFolderIds, onToggleFolder, onNext, onClose }) => {
    const selectedCount = Object.values(selectedFolderIds).filter(Boolean).length;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <h2>Select Folders for Exam</h2>
                <p className="modal-message">Choose one or more folders to source questions from.</p>
                <ul className="exam-folder-list">
                    {allFolders.map(folder => (
                        <li key={folder.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!selectedFolderIds[folder.id]}
                                    onChange={() => onToggleFolder(folder.id)}
                                />
                                {folder.name}
                            </label>
                        </li>
                    ))}
                </ul>
                <div className="modal-actions">
                    <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
                    <button type="button" className="modal-create-btn" onClick={onNext} disabled={selectedCount === 0}>
                        Next ({selectedCount})
                    </button>
                </div>
            </div>
        </div>
    );
};

const ExamConfigModal = ({ onConfirm, onClose }) => {
    const [questionCount, setQuestionCount] = useState(10);
    const [explanationMode, setExplanationMode] = useState('now'); // 'now' or 'later'

    const questionCountOptions = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];

    const handleCreate = () => {
        onConfirm({ questionCount, explanationMode });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Configure Your Exam</h2>
                <div className="exam-config-group">
                    <label htmlFor="question-count">Number of Questions:</label>
                    <select
                        id="question-count"
                        className="folder-select"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                    >
                        {questionCountOptions.map(num => <option key={num} value={num}>{num}</option>)}
                    </select>
                </div>
                <div className="exam-config-group">
                    <label>Explanation Mode:</label>
                    <div className="mode-selector" style={{padding: '5px'}}>
                        <button
                            className={explanationMode === 'now' ? 'active' : ''}
                            onClick={() => setExplanationMode('now')}
                        >
                            Explanations Now
                        </button>
                        <button
                            className={explanationMode === 'later' ? 'active' : ''}
                            onClick={() => setExplanationMode('later')}
                        >
                            Explanations Later
                        </button>
                    </div>
                </div>
                <div className="modal-actions">
                    <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
                    <button type="button" className="modal-create-btn" onClick={handleCreate}>Create Exam</button>
                </div>
            </div>
        </div>
    );
};

const ExplanationModal = ({ question, userAnswer, onClose, onNext, isLastQuestion }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px', textAlign: 'left' }}>
                <h2 style={{ textAlign: 'center', color: userAnswer.isCorrect ? 'var(--success-green)' : 'var(--danger-red)' }}>
                    {userAnswer.isCorrect ? 'Correct!' : 'Incorrect'}
                </h2>
                <div className="explanation-modal-content">
                    {/* --- THIS LINE IS UPDATED --- */}
                    {/* It now finds the explanation for the user's selected answer. */}
                    <p><strong>{question.options.find(opt => opt.text === userAnswer.choice)?.explanation}</strong></p>
                    <ul>
                        {question.options.map((option, index) => (
                           <li key={index} className={option.isCorrect ? 'correct-explanation' : ''}>
                               <strong>{String.fromCharCode(65 + index)} ({option.text}):</strong> {option.explanation}
                           </li> 
                        ))}
                    </ul>
                </div>
                <div className="modal-actions">
                    <button type="button" className="modal-cancel-btn" onClick={onClose}>Back to Question</button>
                    <button type="button" className="modal-create-btn" onClick={onNext}>
                        {isLastQuestion ? 'Finish Exam' : 'Next Question'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProgressModal = ({ message }) => {
    return (
        <div className="modal-overlay progress-overlay">
            <div className="progress-modal-content">
                <div className="spinner"></div>
                <p>{message}</p>
            </div>
        </div>
    );
};

const ExamHubModal = ({ onSelect }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Flash Exam</h2>
                <p className="modal-message">What would you like to do?</p>
                <div className="modal-actions" style={{ flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                    <button onClick={() => onSelect('create')} className="modal-create-btn">Create New Exam</button>
                    <button onClick={() => onSelect('retake')} className="modal-create-btn">Retake Saved Exam</button>
                    <button onClick={() => onSelect('history')} className="modal-create-btn">View Exam History</button>
                    <button onClick={() => onSelect('close')} className="modal-cancel-btn">Back</button>
                </div>
            </div>
        </div>
    );
};

const RetakeExamModal = ({ savedExams, onRetake, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <h2>Retake Saved Exam</h2>
                <ul className="exam-folder-list">
                    {savedExams.length > 0 ? (
                        savedExams.map(exam => (
                            <li key={exam.id} className="retake-exam-item" onClick={() => onRetake(exam.id)}>
                                {exam.title}
                            </li>
                        ))
                    ) : (
                        <p className="subtle-text">You have no saved exams.</p>
                    )}
                </ul>
                <div className="modal-actions">
                    <button type="button" className="modal-cancel-btn" onClick={onClose}>Back</button>
                </div>
            </div>
        </div>
    );
};

const ExamHistoryModal = ({ examHistory, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <h2>Exam History</h2>
                <ul className="exam-history-list">
                    {examHistory.length > 0 ? (
                        examHistory.map(entry => (
                            <li key={entry.id}>
                                <span className="history-score">{entry.score}%</span>
                                <div className="history-details">
                                    <span className="history-title">{entry.title}</span>
                                    <span className="history-date">
                                        {new Date(entry.date).toLocaleString()}
                                    </span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="subtle-text">No exam history yet.</p>
                    )}
                </ul>
                <div className="modal-actions">
                    <button type="button" className="modal-cancel-btn" onClick={onClose}>Back</button>
                </div>
            </div>
        </div>
    );
};

const AnamnesisNemesisLandingPage = ({ onClose, onStartGame }) => {
    return (
        <div className="viewer-overlay anamnesis-landing-page">
            <h1 className="anamnesis-title">ANAMNESIS NEMESIS</h1>
            <p className="anamnesis-tagline">The AI that never forgets, and never forgives.</p>
            <p className="anamnesis-description">
                Go head to head with FlashFonic's dark alter ego. Say your answer out loud. The AI scores your recall - and roasts your soul if you miss.
            </p>

            <div className="anamnesis-features-grid">
                <div className="anamnesis-feature-card">
                    <h3>Verbatim Master Mode (Solo)</h3>
                    <p>Refine your recall with precision. Practice speaking answers exactly as they are on your flashcards, with instant, brutal feedback from the AI.</p>
                </div>
                <div className="anamnesis-feature-card">
                    <h3>Flash Duel (Vs. Friend)</h3>
                    <p>Challenge a friend! Take turns answering questions from your shared deck. The AI judges both of you, leaving no room for debate on who truly knows their stuff.</p>
                </div>
                <div className="anamnesis-feature-card">
                    <h3>Flash Party (Multiplayer)</h3>
                    <p>Host a study session where everyone gets roasted! Players take turns answering different cards from the deck, and the Nemesis AI provides individual feedback.</p>
                </div>
            </div>

            <div className="coming-soon-banner">
                Game Modes Coming Soon!
            </div>
            <button onClick={onClose} className="game-action-btn" style={{marginTop: '1rem'}}>Back to Games</button>
        </div>
    );
};

const CreateFolderModal = ({ onClose, onCreate, title = "Create New Folder" }) => {
    const [folderName, setFolderName] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (folderName.trim()) onCreate(folderName.trim());
    };
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{title}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" className="modal-input" placeholder="Enter name..." value={folderName} onChange={(e) => setFolderName(e.target.value)} autoFocus />
                    <div className="modal-actions">
                        <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="modal-create-btn">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PromptModal = ({ title, message, defaultValue, onClose, onConfirm }) => {
    const [value, setValue] = useState(defaultValue || '');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (value) onConfirm(value);
        onClose();
    };
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{title}</h2>
                <p className="modal-message">{message}</p>
                <form onSubmit={handleSubmit}>
                    <input type="text" className="modal-input" value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
                    <div className="modal-actions">
                        <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="modal-create-btn">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ConfirmModal = ({ message, onClose, onConfirm }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirm Action</h2>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
                    <button type="button" className="modal-create-btn danger" onClick={() => { onConfirm(); onClose(); }}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

const FeedbackModal = ({ onClose }) => {
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setStatus('Thanks for your feedback!');
                form.reset();
                setTimeout(onClose, 2000);
            } else {
                setStatus('Oops! There was a problem submitting your form.');
            }
        } catch (error) {
            setStatus('Oops! There was a problem submitting your form.');
        }
    };

    return (
        <div className="feedback-modal-overlay" onClick={onClose}>
            <div className="feedback-modal-content" onClick={e => e.stopPropagation()}>
                <h2>Send Beta Feedback</h2>
                <form className="feedback-form" onSubmit={handleSubmit} action="https://formspree.io/f/mvgqzvvb" method="POST">
                    <div className="form-group">
                        <label htmlFor="email">Your Email (Optional)</label>
                        <input id="email" type="email" name="email" className="form-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Feedback Type</label>
                        <select id="type" name="type" className="form-select" defaultValue="General Comment">
                            <option>General Comment</option>
                            <option>Bug Report</option>
                            <option>Feature Request</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" className="form-textarea" required />
                    </div>
                    <div className="feedback-modal-actions">
                        <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="modal-create-btn">Submit</button>
                    </div>
                    {status && <p style={{marginTop: '1rem', textAlign: 'center'}}>{status}</p>}
                </form>
            </div>
        </div>
    );
};

const FlashNotesActionModal = ({ folder, onClose, onGenerate, isGenerating }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Flash Notes for "{folder.name}"</h2>
                <p className="modal-message">
                    {folder.flashNotes ? 'Your notes are ready. View them or generate a new version.' : 'Generate themed summary notes from your flashcards.'}
                </p>
                <div className="modal-actions" style={{ flexDirection: 'column', gap: '1rem' }}>
                    <button onClick={() => onGenerate(folder, 'view')} className="modal-create-btn" disabled={isGenerating}>
                        {isGenerating ? 'Please wait...' : (folder.flashNotes ? 'View Notes' : 'Generate & View')}
                    </button>
                    <button onClick={() => onGenerate(folder, 'export')} className="modal-create-btn" disabled={isGenerating}>
                        {isGenerating ? 'Please wait...' : (folder.flashNotes ? 'Export Notes' : 'Generate & Export')}
                    </button>
                    {folder.flashNotes && (
                        <button onClick={() => onGenerate(folder, 'view', true)} className="modal-create-btn danger" disabled={isGenerating}>
                            {isGenerating ? 'Generating...' : 'Regenerate Notes'}
                        </button>
                    )}
                    <button onClick={onClose} className="modal-cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

const FlashNotesViewer = ({ folderName, notes, onClose }) => {
    return (
        <div className="viewer-overlay" onClick={onClose}>
            <div className="flash-notes-container" onClick={e => e.stopPropagation()}>
                <div className="viewer-header">
                    <h2>Flash Notes: {folderName}</h2>
                    <button onClick={onClose} className="viewer-close-btn">&times;</button>
                </div>
                <div className="flash-notes-content" dangerouslySetInnerHTML={{ __html: marked(notes) }} />
                <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                    <button onClick={onClose} className="modal-create-btn">Close</button>
                </div>
            </div>
        </div>
    );
};

const ActionsDropdown = ({ folder, onRenameFolder, onAddSubfolder, onDeleteFolder, exportPdf, exportCsv }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleActionClick = (e, actionFn) => {
        e.stopPropagation();
        actionFn();
        setIsOpen(false);
    };

    return (
        <div className="actions-dropdown-container" ref={menuRef}>
            <button className="actions-tab" onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>Actions</button>
            {isOpen && (
                <div className="actions-dropdown-menu">
                    <button onClick={(e) => handleActionClick(e, () => onAddSubfolder(folder.id))}>Add Subfolder</button>
                    <button onClick={(e) => handleActionClick(e, () => onRenameFolder(folder.id, folder.name))}>Rename Folder</button>
                    <button onClick={(e) => handleActionClick(e, () => onDeleteFolder(folder.id))}>Delete Folder</button>
                    <hr style={{borderTop: '1px solid var(--border-color)', margin: '0.5rem 0'}} />
                    <button onClick={(e) => handleActionClick(e, () => exportPdf(folder.id))}>Export PDF</button>
                    <button onClick={(e) => handleActionClick(e, () => exportCsv(folder.id))}>Export CSV</button>
                </div>
            )}
        </div>
    );
};


const FlashcardViewer = ({ folder, onClose, onLaunchGame, onLaunchAnamnesisNemesis }) => {
    const [deck, setDeck] = useState([...folder.cards]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isArrangeMode, setIsArrangeMode] = useState(false);
    const [reviewMode, setReviewMode] = useState('all');
    const [isReading, setIsReading] = useState(false);
    const [speechRate, setSpeechRate] = useState(1);
    const [speechDelay, setSpeechDelay] = useState(3);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const speechTimeoutRef = useRef(null);
    const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);
    const voiceDropdownRef = useRef(null);

    const studyDeck = useMemo(() => {
        if (reviewMode === 'flagged') {
            return deck.filter(card => card.isFlagged);
        }
        return deck;
    }, [deck, reviewMode]);

    const currentCard = studyDeck[currentIndex];
    const currentCardId = currentCard ? currentCard.id : null;

    useEffect(() => {
        if (isArrangeMode || !currentCardId) return;

        setDeck(prevDeck => {
            const cardInDeck = prevDeck.find(c => c.id === currentCardId);
            if (cardInDeck && (!cardInDeck.lastViewed || (Date.now() - cardInDeck.lastViewed > 5000))) {
                return prevDeck.map(card =>
                    card.id === currentCardId ? { ...card, lastViewed: Date.now() } : card
                );
            }
            return prevDeck;
        });

    }, [currentCardId, isArrangeMode]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (voiceDropdownRef.current && !voiceDropdownRef.current.contains(event.target)) {
                setIsVoiceDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            const englishVoices = availableVoices.filter(voice => voice.lang.startsWith('en'));
            setVoices(englishVoices);
            if (englishVoices.length > 0 && !selectedVoice) {
                setSelectedVoice(englishVoices[0].name);
            }
        };
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, [selectedVoice]);

    const speak = useCallback((text, onEnd) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;
        utterance.rate = speechRate;
        utterance.onend = onEnd;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }, [voices, selectedVoice, speechRate]);

    const stopReading = useCallback(() => {
        setIsReading(false);
        window.speechSynthesis.cancel();
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    }, []);

    useEffect(() => {
        if (!isReading || !currentCard) return;
        const readCardSequence = () => {
            setIsFlipped(false);
            const questionText = `Question: ${currentCard.question}`;
            speak(questionText, () => {
                speechTimeoutRef.current = setTimeout(() => {
                    setIsFlipped(true);
                    const answerText = `Answer: ${currentCard.answer}`;
                    speak(answerText, () => {
                        setCurrentIndex(prev => (prev + 1) % studyDeck.length);
                    });
                }, speechDelay * 1000);
            });
        };
        readCardSequence();
        return () => {
            window.speechSynthesis.cancel();
            clearTimeout(speechTimeoutRef.current);
        };
    }, [isReading, currentIndex, studyDeck, speechDelay, currentCard, speak]);

    const handleCardClick = () => {
        if (studyDeck.length === 0) return;
        stopReading();
        setIsFlipped(prev => !prev);
    };

    const goToNext = useCallback(() => {
        if (studyDeck.length === 0) return;
        stopReading();
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % studyDeck.length);
    }, [studyDeck.length, stopReading]);

    const goToPrev = useCallback(() => {
        if (studyDeck.length === 0) return;
        stopReading();
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + studyDeck.length) % studyDeck.length);
    }, [studyDeck.length, stopReading]);

    const scrambleDeck = () => {
        stopReading();
        const newDeckOrder = [...deck].sort(() => Math.random() - 0.5);
        setDeck(newDeckOrder);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const toggleFlag = (cardId) => {
        setDeck(prevDeck => prevDeck.map(card =>
            card.id === cardId ? { ...card, isFlagged: !card.isFlagged } : card
        ));
    };

    const handleReviewModeChange = (mode) => {
        stopReading();
        setReviewMode(mode);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const handleDragStart = (e, index) => e.dataTransfer.setData("cardIndex", index);

    const handleDrop = (e, dropIndex) => {
        const dragIndex = e.dataTransfer.getData("cardIndex");
        const newDeck = [...deck];
        const [draggedItem] = newDeck.splice(dragIndex, 1);
        newDeck.splice(dropIndex, 0, draggedItem);
        setDeck(newDeck);
    };

    useEffect(() => { return () => stopReading(); }, [stopReading]);

    const flaggedCount = useMemo(() => deck.filter(c => c.isFlagged).length, [deck]);

    return (
        <div className="viewer-overlay">
            <div className="viewer-header">
                <h2>Studying: {folder.name}</h2>
                <button onClick={() => onClose(deck)} className="viewer-close-btn">&times;</button>
            </div>
            <div className="viewer-controls">
                <button onClick={scrambleDeck}>Scramble</button>
                <button onClick={() => setIsArrangeMode(!isArrangeMode)}>{isArrangeMode ? 'Study' : 'Arrange'}</button>
                <button onClick={() => handleReviewModeChange('all')} className={reviewMode === 'all' ? 'active' : ''}>Review All</button>
                <button onClick={() => handleReviewModeChange('flagged')} className={reviewMode === 'flagged' ? 'active' : ''}>{`Flagged (${flaggedCount})`}</button>
            </div>
            {isArrangeMode ? (
                <div className="arrange-container">
                    <h3>Drag and drop to reorder</h3>
                    {deck.map((card, index) => (
                        <div key={card.id} className="arrange-card" draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, index)}>
                            {index + 1}. <ContentRenderer content={card.question} />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="study-area-main">
                        {studyDeck.length > 0 ? (
                            <>
                                <div className="viewer-main" onClick={handleCardClick}>
                                    <div className={`viewer-card ${isFlipped ? 'is-flipped' : ''}`}>
                                        <div className="card-face card-front">
                                            <button onClick={(e) => { e.stopPropagation(); toggleFlag(currentCard.id); }} className={`flag-btn ${currentCard?.isFlagged ? 'active' : ''}`}>&#9873;</button>
                                            <p><strong>Q:</strong> <ContentRenderer content={currentCard?.question} /></p>
                                        </div>
                                        <div className="card-face card-back">
                                            <button onClick={(e) => { e.stopPropagation(); toggleFlag(currentCard.id); }} className={`flag-btn ${currentCard?.isFlagged ? 'active' : ''}`}>&#9873;</button>
                                            <p><strong>A:</strong> <ContentRenderer content={currentCard?.answer} reactionSummary={currentCard?.reactionSummary} /></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="viewer-nav">
                                    <button onClick={goToPrev}>&larr; Prev</button>
                                    <span>{currentIndex + 1} / {studyDeck.length}</span>
                                    <button onClick={goToNext} >Next &rarr;</button>
                                </div>
                            </>
                        ) : (
                            <div className="viewer-empty">
                                <p>No cards to display in this mode.</p>
                                {reviewMode === 'flagged' && <p>Flag some cards during your "Review All" session to study them here.</p>}
                            </div>
                        )}
                    </div>
                    <div className="study-area-footer">
                        <div className="tts-controls">
                            <button onClick={isReading ? stopReading : () => setIsReading(true)} className="tts-play-btn">{isReading ? '■ Stop Audio' : '▶ Play Audio'}</button>
                            <div className="tts-slider-group custom-select-container" ref={voiceDropdownRef}>
                                <label>Voice</label>
                                <div className="custom-select-trigger" onClick={() => !isReading && setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}>
                                    {selectedVoice || 'Select a voice...'}
                                    <span className={`arrow ${isVoiceDropdownOpen ? 'up' : 'down'}`}></span>
                                </div>
                                {isVoiceDropdownOpen && (
                                    <div className="custom-select-options">
                                        {voices.map(voice => (
                                            <div key={voice.name} className="custom-select-option" onClick={() => { setSelectedVoice(voice.name); setIsVoiceDropdownOpen(false); }}>
                                                {voice.name} ({voice.lang})
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="tts-slider-group">
                                <label>Front to back delay: {speechDelay}s</label>
                                <input type="range" min="1" max="10" step="1" value={speechDelay} onChange={(e) => setSpeechDelay(Number(e.target.value))} disabled={isReading} />
                            </div>
                            <div className="tts-slider-group">
                                <label>Speed: {speechRate}x</label>
                                <input type="range" min="0.5" max="2" step="0.1" value={speechRate} onChange={(e) => setSpeechRate(Number(e.target.value))} disabled={isReading} />
                            </div>
                        </div>
                        <div className="games-section-container">
                            <h3>Games</h3>
                            <button className="game-launch-btn" onClick={() => onLaunchGame(folder)}>Verbatim Master AI</button>
                            <button className="game-launch-btn" onClick={() => onLaunchAnamnesisNemesis(folder)}>Anamnesis Nemesis</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const GameViewer = ({ folder, onClose, onBackToStudy, onExitGame, cameFromStudy, mostRecentScore }) => {
    const [deck, setDeck] = useState([...folder.cards].sort(() => Math.random() - 0.5));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('landing');
    const [userAnswer, setUserAnswer] = useState('');
    const [lastScore, setLastScore] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [playMode, setPlayMode] = useState('continuous');
    
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);
    const voiceDropdownRef = useRef(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordingTimeoutRef = useRef(null);

    const currentCard = deck[currentIndex];
    
    const startGameSequence = () => {
        const primingUtterance = new SpeechSynthesisUtterance(' ');
        primingUtterance.volume = 0;
        window.speechSynthesis.speak(primingUtterance);
        setGameState('starting');
    };

    const sounds = useMemo(() => {
        const createSynth = (oscillatorType) => new Tone.Synth({
            oscillator: { type: oscillatorType },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 }
        }).toDestination();
        return {
            perfect: () => { const synth = createSynth('sine'); synth.triggerAttackRelease('C5', '8n', Tone.now()); synth.triggerAttackRelease('G5', '8n', Tone.now() + 0.1); },
            good: () => { const synth = createSynth('triangle'); synth.triggerAttackRelease('E5', '8n'); },
            ok: () => { const synth = createSynth('square'); synth.triggerAttackRelease('C4', '8n'); },
            wrong: () => { const noiseSynth = new Tone.NoiseSynth().toDestination(); noiseSynth.triggerAttackRelease('4n'); }
        };
    }, []);

    // --- FIX: SCOREBOARD CALCULATION ---
    // The getMedal function now accepts the final score directly to ensure it calculates the rank correctly.
    const getMedal = useCallback((finalScore) => {
        const totalPossible = deck.length * 100;
        if (totalPossible === 0) return { name: 'Mnemonic Casualty', animation: 'casualty-animation', icon: '🩹' };
        const percentage = (finalScore / totalPossible) * 100;

        if (percentage === 100) return { name: 'Verbatim Master', animation: 'gold-medal-animation', icon: '🏆' };
        if (percentage >= 90) return { name: 'Synapse Slayer', animation: 'gold-medal-animation', icon: '🧠' };
        if (percentage >= 80) return { name: 'Recall Assassin', animation: 'silver-medal-animation', icon: '🗡️' };
        if (percentage >= 70) return { name: 'Mind Sniper', animation: 'bronze-medal-animation', icon: '🎯' };
        return { name: 'Mnemonic Casualty', animation: 'casualty-animation', icon: '🩹' };
    }, [deck.length]);

    // --- FIX: SCOREBOARD CALCULATION ---
    // nextRound now accepts the points from the round that just finished.
    const nextRound = useCallback((pointsFromThisRound = 0) => {
        setUserAnswer('');
        setLastScore(null);
        if (currentIndex < deck.length - 1) {
            setCurrentIndex(i => i + 1);
            setGameState('starting');
        } else {
            // It calculates the true final score before ending the game.
            const finalScore = score + pointsFromThisRound;
            const finalMedal = getMedal(finalScore);
            onClose(folder.id, finalScore, playerName, finalMedal.name); 
            setGameState('game_over');
        }
    }, [currentIndex, deck.length, onClose, folder.id, score, playerName, getMedal]);

    const speak = useCallback((text, onEndCallback) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;
        utterance.rate = 1;
        utterance.onend = onEndCallback;
        window.speechSynthesis.speak(utterance);
    }, [voices, selectedVoice]);

    const submitAnswer = useCallback(async (transcribedText) => {
        setUserAnswer(transcribedText);

        if (!transcribedText || !transcribedText.trim()) {
            setLastScore(0);
            sounds.wrong();
            const feedbackText = "I didn't hear an answer. The correct answer was: " + currentCard.answer;
            speak(feedbackText, () => {
                // --- FIX: SCOREBOARD CALCULATION ---
                // We pass 0 points to the nextRound function.
                if (playMode === 'continuous') setTimeout(() => nextRound(0), 3000);
            });
            setGameState('round_result');
            return;
        }

        try {
            const response = await fetch('https://flashfonic-backend-shewski.replit.app/score-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userAnswer: transcribedText, correctAnswer: currentCard.answer })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Scoring failed');
            
            const receivedScore = data.score;
            setLastScore(receivedScore);

            let feedbackText = '';
            if (receivedScore >= 70) {
                feedbackText = `Correct, for ${receivedScore} points.`;
                if (receivedScore === 100) sounds.perfect(); else sounds.good();
                setScore(s => s + receivedScore);
            } else if (receivedScore >= 30) {
                feedbackText = `Partially correct, for ${receivedScore} points. The correct answer was: ${currentCard.answer}`;
                sounds.ok();
                setScore(s => s + receivedScore);
            } else {
                feedbackText = `Incorrect. The correct answer was: ${currentCard.answer}`;
                sounds.wrong();
            }
            // --- FIX: SCOREBOARD CALCULATION ---
            // We pass the actual receivedScore to the nextRound function.
            speak(feedbackText, () => { if (playMode === 'continuous') setTimeout(() => nextRound(receivedScore), 3000); });
            setGameState('round_result');

        } catch (error) {
            console.error("Error scoring answer:", error);
            setLastScore(0);
            sounds.wrong();
            const feedbackText = "Error scoring. The correct answer was: " + currentCard.answer;
            // --- FIX: SCOREBOARD CALCULATION ---
            // We pass 0 points if there was an error.
            speak(feedbackText, () => { if (playMode === 'continuous') setTimeout(() => nextRound(0), 3000); });
            setGameState('round_result');
        }
    }, [currentCard, sounds, playMode, nextRound, speak]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = e => audioChunksRef.current.push(e.data);

            mediaRecorderRef.current.onstop = async () => {
                setIsRecording(false);
                stream.getTracks().forEach(track => track.stop());
                setGameState('scoring');
                
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = reader.result.split(',')[1];
                    try {
                        const res = await fetch('https://flashfonic-backend-shewski.replit.app/transcribe-answer', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ audio_data: base64Audio })
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || 'Transcription failed');
                        submitAnswer(data.transcript);
                    } catch (error) {
                        console.error("Transcription error:", error);
                        submitAnswer("[Error transcribing audio]");
                    }
                };
            };
            
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setGameState('listening');

            recordingTimeoutRef.current = setTimeout(() => {
                if (mediaRecorderRef.current?.state === 'recording') {
                    mediaRecorderRef.current.stop();
                }
            }, 7000);

        } catch (err) {
            console.error("Microphone access error:", err);
            speak("I couldn't access the microphone. Please check permissions.");
            setTimeout(() => nextRound(0), 3000);
        }
    }, [submitAnswer, nextRound, speak]);

    const askQuestion = useCallback(() => {
        if (!currentCard) return;
        setGameState('asking');
        speak(`Question: ${currentCard.question}`, () => {
            startRecording();
        });
    }, [currentCard, speak, startRecording]);

    const stopAllAudio = () => {
        window.speechSynthesis.cancel();
        clearTimeout(recordingTimeoutRef.current);
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
    };

    const handleExit = () => { stopAllAudio(); onExitGame(); };
    const handleBackButton = () => { stopAllAudio(); if (cameFromStudy) { onBackToStudy(folder); } else { onExitGame(); } };
    const handlePause = () => { stopAllAudio(); setIsPaused(true); };
    const handleResume = () => { setIsPaused(false); askQuestion(); };

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
            setVoices(englishVoices);
            if (englishVoices.length > 0 && !selectedVoice) setSelectedVoice(englishVoices[0].name);
        };
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
        return () => { window.speechSynthesis.onvoiceschanged = null; };
    }, [selectedVoice]);

    useEffect(() => {
        if (gameState === 'starting') {
            const timer = setTimeout(askQuestion, 3000);
            return () => clearTimeout(timer);
        }
    }, [gameState, askQuestion]);
    
    const playAgain = () => {
        setDeck([...folder.cards].sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
        setScore(0);
        setUserAnswer('');
        setLastScore(null);
        setGameState(playerName ? 'ready' : 'name_entry');
    };

    const renderVoiceSelector = () => (
        <div className="tts-slider-group custom-select-container" ref={voiceDropdownRef}>
            <label>Voice</label>
            <div className="custom-select-trigger" onClick={() => setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}>
                {selectedVoice || 'Select a voice...'}
                <span className={`arrow ${isVoiceDropdownOpen ? 'up' : 'down'}`}></span>
            </div>
            {isVoiceDropdownOpen && (
                <div className="custom-select-options">
                    {voices.map(voice => (
                        <div key={voice.name} className="custom-select-option" onClick={() => { setSelectedVoice(voice.name); setIsVoiceDropdownOpen(false); }}>
                            {voice.name} ({voice.lang})
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderGameState = () => {
        if (isPaused) {
            return (
                <div className="game-pause-overlay">
                    <h2>Paused</h2>
                    <div className="game-end-actions">
                        <button className="game-action-btn" onClick={handleResume}>Resume</button>
                        <button className="game-action-btn" onClick={handleExit}>Exit Game</button>
                    </div>
                </div>
            );
        }
        switch (gameState) {
            case 'landing':
                return (
                    <div className="game-landing-page">
                        <h1 className="game-landing-title">VERBATIM MASTER AI</h1>
                        <div className="game-landing-actions">
                            <button className="game-action-btn" onClick={() => setGameState('name_entry')}>Start Game</button>
                            <button className="game-action-btn" onClick={() => setShowHowToPlay(true)}>How to Play</button>
                            <button className="game-action-btn" onClick={() => setShowLeaderboard(true)}>Leaderboard</button>
                        </div>
                        <div className="game-play-mode-selector">
                            <button
                                className={`game-mode-btn ${playMode === 'manual' ? 'active' : ''}`}
                                onClick={() => setPlayMode('manual')} >
                                Manual Play
                            </button>
                            <button
                                className={`game-mode-btn ${playMode === 'continuous' ? 'active' : ''}`}
                                onClick={() => setPlayMode('continuous')} >
                                Continuous Play
                            </button>
                        </div>
                        <div className="game-landing-voice-selector">{renderVoiceSelector()}</div>
                        <button className="game-action-btn" onClick={handleBackButton}>Back</button>
                    </div>
                );
            case 'name_entry':
                return <EnterNameModal onClose={() => setGameState('landing')} onConfirm={(name) => { setPlayerName(name); setGameState('ready'); }} />;
            case 'ready':
                return ( <div className="game-status-fullscreen"><button className="game-start-button" onClick={startGameSequence}>START</button></div> );
            case 'starting':
                return <div className="game-status-fullscreen">Get Ready...</div>;
            case 'asking':
                return <div className="game-status-fullscreen">Listen...</div>;
            case 'listening':
                return (
                    <div className="game-listening-container">
                        <div className="mic-animation"><span className="mic-icon">🎤</span><div className="mic-wave"></div></div>
                        <p>Listening...</p>
                    </div>
                );
            case 'scoring':
                return <div className="game-status-fullscreen">Judging...</div>;
            case 'round_result':
                const isCorrect = lastScore >= 30;
                return (
                    <div className={`game-result-fullscreen ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? (
                            <>
                                <div className="score-feedback-animation">+{lastScore}</div>
                                <h2>Nice!</h2>
                            </>
                        ) : (
                            <>
                                <div className="score-feedback-animation incorrect-x">✕</div>
                                <h2>Incorrect</h2>
                                {/* --- FIX: DISPLAY TRANSCRIBED TEXT --- */}
                                {userAnswer && <p className="correct-answer-reveal" style={{ fontStyle: 'italic', color: 'var(--text-soft)'}}>You said: "{userAnswer}"</p>}
                                <p className="correct-answer-reveal">Correct Answer: <ContentRenderer content={currentCard.answer} /></p>
                            </>
                        )}
                        {playMode === 'manual' && ( <button className="game-next-btn" onClick={() => nextRound(lastScore > 0 ? lastScore : 0)}>Next</button> )}
                        {playMode === 'continuous' && ( <p className="continuous-play-notice">Next card coming up...</p> )}
                    </div>
                );
            case 'game_over':
                const finalScore = score; 
                const finalMedal = getMedal(finalScore);
                
                const currentLeaderboard = [...(folder.leaderboard || [])];
                if (mostRecentScore && !currentLeaderboard.some(entry => entry.id === mostRecentScore.id)) {
                    currentLeaderboard.push(mostRecentScore);
                }
                const sortedLeaderboard = currentLeaderboard.sort((a, b) => b.score - a.score);

                return (
                    <div className="game-over-container">
                        <h2 className="game-over-title">{finalMedal.name}</h2>
                        <div className={`medal-container ${finalMedal.animation}`}><span className="medal-icon">{finalMedal.icon}</span></div>
                        <p className="final-score-display">Total Score: {mostRecentScore ? mostRecentScore.score : score} / {deck.length * 100}</p>
                        <div className="leaderboard-container">
                            <h3>High Scores</h3>
                            <div className="leaderboard-list">
                                <div><span>Rank</span><span>Name</span><span>Level</span><span style={{textAlign: 'right'}}>Score</span></div>
                                {sortedLeaderboard.length > 0 ? sortedLeaderboard.slice(0, 10).map((entry, index) => (
                                    <li key={entry.id || index} className={entry.id === mostRecentScore?.id ? 'recent-score' : ''}>
                                        <span>#{index + 1}</span>
                                        <span>{(entry.name || 'ANONYMOUS').toUpperCase()}</span>
                                        <span>{entry.level}</span>
                                        <span>{entry.score}</span>
                                    </li>
                                )) : <li><p>No scores yet. Be the first!</p></li>}
                            </div>
                        </div>
                        <div className="game-end-actions">
                            <button className="game-action-btn" onClick={playAgain}>Play Again</button>
                            <button className="game-action-btn" onClick={() => onBackToStudy(folder)}>Back to Study</button>
                        </div>
                    </div>
                );
            default: return null;
        }
    };
    
    if (showLeaderboard) {
        const sortedLeaderboard = [...(folder.leaderboard || [])].sort((a,b) => b.score - a.score);
        return (
            <div className="viewer-overlay game-mode">
                <div className="leaderboard-container full-page">
                    <h2>Leaderboard: {folder.name}</h2>
                    <div className="leaderboard-list">
                        <div><span>Rank</span><span>Name</span><span>Level</span><span style={{textAlign: 'right'}}>Score</span></div>
                       {sortedLeaderboard.length > 0 ? sortedLeaderboard.map((entry, index) => (
                            <li key={entry.id || index}>
                                <span>#{index + 1}</span>
                                <span>{(entry.name || 'ANONYMOUS').toUpperCase()}</span>
                                <span>{entry.level}</span>
                                <span>{entry.score}</span>
                            </li>
                       )) : <li><p>No scores yet. Be the first!</p></li>}
                    </div>
                    <div className="game-end-actions">
                        <button className="game-action-btn" onClick={() => setShowLeaderboard(false)}>Back to Game</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="viewer-overlay game-mode">
            {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
            
            {gameState !== 'landing' && gameState !== 'game_over' && (
                <>
                    <div className="game-header">
                        <h3>VERBATIM MASTER AI</h3>
                        <div className="game-info">
                            <span>Card: {currentIndex + 1} / {deck.length}</span>
                            <span>Score: {score}</span>
                        </div>
                        <button onClick={handleExit} className="viewer-close-btn">&times;</button>
                    </div>
                    {gameState !== 'ready' && (
                        <div className="game-card-area">
                            <div className="game-card">
                                <p className="game-question"><strong>Q:</strong> <ContentRenderer content={currentCard?.question} /></p>
                            </div>
                        </div>
                    )}
                    <div className="in-game-voice-selector">
                        {renderVoiceSelector()}
                    </div>
                    {!isPaused && gameState !== 'ready' && (
                        <div className="in-game-controls">
                            <button onClick={handlePause}>Pause</button>
                            <button onClick={handleExit}>Exit</button>
                        </div>
                    )}
                </>
            )}
            
            <div className="game-state-overlay">
                {renderGameState()}
            </div>
        </div>
    );
};

const ExamViewer = ({ exam, onClose, onCreateFlaggedFolder, onSaveAndRecord }) => {
    const [shuffledExam, setShuffledExam] = useState(null);
    const [gameState, setGameState] = useState('testing'); // 'testing', 'results', 'reviewing'
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [flaggedQuestions, setFlaggedQuestions] = useState({});
    const [showExplanationModal, setShowExplanationModal] = useState(false);

    useEffect(() => {
        const shuffleOptions = (question) => {
            const newOptions = [...question.options];
            for (let i = newOptions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newOptions[i], newOptions[j]] = [newOptions[j], newOptions[i]];
            }
            return { ...question, options: newOptions };
        };
        const newShuffledQuestions = exam.questions.map(shuffleOptions);
        setShuffledExam({ ...exam, questions: newShuffledQuestions });
    }, [exam]);

    // This useEffect is now removed, as saving is no longer automatic.

    if (!shuffledExam) {
        return <div className="viewer-overlay">Preparing Exam...</div>;
    }

    const currentQuestion = shuffledExam.questions[currentIndex];
    
    const handleToggleFlag = () => setFlaggedQuestions(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }));

    const handleAnswerSelect = (selectedOption) => {
        if (gameState !== 'testing' || userAnswers[currentIndex]) return;
        
        const isCorrect = selectedOption.isCorrect;
        setUserAnswers(prev => ({ ...prev, [currentIndex]: { choice: selectedOption.text, isCorrect } }));

        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        if (exam.config.explanationMode === 'now') {
            setShowExplanationModal(true);
        }
    };

    const handleNext = () => {
        if (currentIndex < shuffledExam.questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setGameState('results');
        }
    };

    const handleReview = () => {
        setCurrentIndex(0);
        setGameState('reviewing');
    };
    
    const handleCloseExplanation = () => setShowExplanationModal(false);
    const handleAdvanceFromExplanation = () => {
        setShowExplanationModal(false);
        handleNext();
    };

    const isAnswered = userAnswers[currentIndex] !== undefined;
    const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

    if (gameState === 'results') {
        const totalQuestions = shuffledExam.questions.length;
        const percentage = Math.round((score / totalQuestions) * 100);
        return (
            <div className="viewer-overlay exam-viewer-overlay">
                <div className="exam-results-container">
                    <h2>Exam Complete!</h2>
                    <p className="final-score-percent">{percentage}%</p>
                    <p className="final-score-details">You answered {score} out of {totalQuestions} questions correctly.</p>
                    {flaggedCount > 0 && <p className="final-score-details">{flaggedCount} questions flagged for review.</p>}
                    <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
                        <button className="modal-cancel-btn" onClick={handleReview}>Review Answers</button>
                        {/* --- THIS BUTTON IS UPDATED --- */}
                        <button 
                            className="modal-create-btn"
                            onClick={() => onSaveAndRecord(exam, score)}
                        >
                            Save Exam & Score
                        </button>
                        <button 
                            className="modal-create-btn" 
                            onClick={() => onCreateFlaggedFolder(shuffledExam, flaggedQuestions)}
                            disabled={flaggedCount === 0}
                            style={{backgroundColor: 'var(--gold)', color: 'var(--dark-bg)'}}
                        >
                            Create Folder from Flagged ({flaggedCount})
                        </button>
                        <button className="modal-create-btn" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="viewer-overlay exam-viewer-overlay">
            <div className="exam-header">
                <div className="exam-header-item exam-header-title">
                    <h2>{gameState === 'reviewing' ? 'Reviewing Exam' : 'Flash Exam'}</h2>
                </div>
                <div className="exam-header-item exam-header-progress">
                    Question {currentIndex + 1} of {shuffledExam.questions.length}
                </div>
                <div className="exam-header-item exam-header-flag">
                    <button onClick={handleToggleFlag} className={`flag-btn ${flaggedQuestions[currentIndex] ? 'active' : ''}`}>
                        &#9873; {flaggedQuestions[currentIndex] ? 'Flagged' : 'Flag'}
                    </button>
                </div>
                <div className="exam-header-item exam-header-close">
                    <button onClick={onClose} className="viewer-close-btn">&times;</button>
                </div>
            </div>

            <div className="exam-question-container">
                <p>{currentQuestion.questionText}</p>
            </div>

            <div className="answer-choices">
                {currentQuestion.options.map((option, index) => {
                    const choiceLetter = String.fromCharCode(65 + index);
                    const isSelectedChoice = userAnswers[currentIndex]?.choice === option.text;
                    let choiceStatus = '';
                    if (isAnswered) {
                        if (option.isCorrect) choiceStatus = 'correct';
                        else if (isSelectedChoice) choiceStatus = 'incorrect';
                    }
                    return (
                        <button
                            key={index}
                            className={`choice-btn ${choiceStatus}`}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={isAnswered || gameState === 'reviewing'}
                        >
                            <span className="choice-letter">{choiceLetter}</span>
                            <span className="choice-text">{option.text}</span>
                        </button>
                    );
                })}
            </div>
            
            {(isAnswered && (exam.config.explanationMode === 'later' || !showExplanationModal)) || gameState === 'reviewing' ? (
                <div className="exam-footer">
                     {gameState === 'reviewing' && (
                        <button 
                            className="exam-next-btn" 
                            style={{backgroundColor: 'var(--primary-purple)'}}
                            onClick={() => setShowExplanationModal(true)}
                        >
                            Show Explanation
                        </button>
                    )}
                    <button className="exam-next-btn" onClick={handleNext}>
                        {currentIndex < shuffledExam.questions.length - 1 ? 'Next Question' : (gameState === 'testing' ? 'Finish Exam' : 'Finish Review')}
                    </button>
                </div>
            ) : null}
            
            {showExplanationModal && (
                <ExplanationModal
                    question={currentQuestion}
                    userAnswer={userAnswers[currentIndex]}
                    onClose={() => setShowExplanationModal(false)}
                    onNext={() => { setShowExplanationModal(false); handleNext(); }}
                    isLastQuestion={currentIndex === shuffledExam.questions.length - 1}
                />
            )}
        </div>
    );
};

const ChemicalImage = ({ src, alt }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            {isLoading && <span style={{ fontSize: '0.8em', color: 'var(--text-dark)' }}>Loading Structure...</span>}
            <img
                src={src}
                alt={alt}
                style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    maxWidth: '38%',
                    minWidth: '90px',
                    display: isLoading ? 'none' : 'block'
                }}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
            />
        </>
    );
};

const KatexRenderer = ({ text }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && window.katex) {
            const renderMathInText = (text) => {
                const blockRegex = /\$\$(.*?)\$\$/g;
                const inlineRegex = /\$(.*?)\$/g;

                let html = text.replace(blockRegex, (match, expression) => {
                    try {
                        return window.katex.renderToString(expression, { throwOnError: false, displayMode: true });
                    } catch (e) {
                        console.error("KaTeX rendering error:", e);
                        return match;
                    }
                });

                html = html.replace(inlineRegex, (match, expression) => {
                    if (match.startsWith('$$')) return match;
                    try {
                        return window.katex.renderToString(expression, { throwOnError: false, displayMode: false });
                    } catch (e) {
                        console.error("KaTeX rendering error:", e);
                        return match;
                    }
                });
                return html;
            };
            
            containerRef.current.innerHTML = renderMathInText(text);
        }
    }, [text]);

    return <span ref={containerRef} />;
};

const ContentRenderer = ({ content, reactionSummary }) => {
    // --- Handles the new, structured full_reaction format ---
    if (typeof content === 'object' && !Array.isArray(content) && content !== null && content.type === 'full_reaction') {
        return (
            // This new wrapper div allows us to add the summary below the reaction
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div className="reaction-container">
                    {/* Renders the Reactants on the left side */}
                    <div className="reaction-side">
                        {content.reactants.map((reactant, index) => (
                            <React.Fragment key={`reactant-${index}`}>
                                <ContentRenderer content={[reactant]} />
                                {index < content.reactants.length - 1 && <span className="plus-sign">+</span>}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Renders the Arrow and the Reagents above it */}
                    <div className="reaction-arrow-group">
                        <span className="reagents">{content.reagents.join(', ')}</span>
                        <span className="arrow">→</span>
                    </div>

                    {/* Renders the Products on the right side */}
                    <div className="reaction-side">
                        {content.products.map((product, index) => (
                            <React.Fragment key={`product-${index}`}>
                                <ContentRenderer content={[product]} />
                                {index < content.products.length - 1 && <span className="plus-sign">+</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                {/* --- THIS IS THE FIX --- */}
                {/* We now check for and display the reactionSummary for complex reactions too */}
                {reactionSummary && (
                    <p style={{ margin: '0.75rem 0 0 0', fontStyle: 'italic', fontSize: '0.85em', maxWidth: '90%' }}>
                        {reactionSummary}
                    </p>
                )}
            </div>
        );
    }

    // --- Original logic for simple reactions, molecules, and text ---
    if (Array.isArray(content)) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {content.map((item, index) => {
                        const chemRegex = /CHEM\[(.*?)\]/;
                        const match = typeof item === 'string' && item.match(chemRegex);
                        if (match) {
                            const chemicalName = encodeURIComponent(match[1]);
                            const imageUrl = `https://cactus.nci.nih.gov/chemical/structure/${chemicalName}/image?format=png&width=300&height=300`;
                            return (
                                <React.Fragment key={index}>
                                    <ChemicalImage src={imageUrl} alt={`Structure of ${match[1]}`} />
                                    {index < content.length - 1 && <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>→</span>}
                                </React.Fragment>
                            );
                        }
                        return null;
                    })}
                </div>
                {reactionSummary && (
                    <p style={{ margin: '0.75rem 0 0 0', fontStyle: 'italic', fontSize: '0.85em', maxWidth: '90%' }}>
                        {reactionSummary}
                    </p>
                )}
            </div>
        );
    }
    
    if (typeof content === 'string') {
        const reactionRegex = /SMILES\[(.*?)\]>>SMILES\[(.*?)\]/;
        const reactionMatch = content.match(reactionRegex);
        if (reactionMatch) {
            const reactantSmiles = encodeURIComponent(reactionMatch[1]);
            const productSmiles = encodeURIComponent(reactionMatch[2]);
            const reactantImageUrl = `https://cactus.nci.nih.gov/chemical/structure/${reactantSmiles}/image?format=png&width=400&height=400`;
            const productImageUrl = `https://cactus.nci.nih.gov/chemical/structure/${productSmiles}/image?format=png&width=400&height=400`;
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <ChemicalImage src={reactantImageUrl} alt="Reactant Structure" />
                    <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>→</span>
                    <ChemicalImage src={productImageUrl} alt="Product Structure" />
                </div>
            );
        }
        
        const singleMoleculeRegex = /SMILES\[(.*?)\]/;
        const singleMatch = content.match(singleMoleculeRegex);
        if (singleMatch) {
            const smiles = encodeURIComponent(singleMatch[1]);
            const imageUrl = `https://cactus.nci.nih.gov/chemical/structure/${smiles}/image?format=png&width=500&height=500`;
            return <ChemicalImage src={imageUrl} alt="Chemical Structure" />;
        }
        
        return <KatexRenderer text={content} />;
    }

    return null;
};

// --- REFACTOR FIX: STABLE & CORRECTED COMPONENTS ---
// These components are now defined outside MainApp to prevent re-renders and fix all bugs.

const EditableCardContent = ({ card, onSave, onCancel }) => {
    const [question, setQuestion] = useState(card.question);
    const [answer, setAnswer] = useState(
        typeof card.answer === 'string' ? card.answer : JSON.stringify(card.answer, null, 2)
    );

    useEffect(() => {
        setQuestion(card.question);
        setAnswer(typeof card.answer === 'string' ? card.answer : JSON.stringify(card.answer, null, 2));
    }, [card]);

    const handleSave = () => {
        let parsedAnswer = answer;
        try {
            if ((answer.startsWith('[') && answer.endsWith(']')) || (answer.startsWith('{') && answer.endsWith('}'))) {
                parsedAnswer = JSON.parse(answer);
            }
        } catch (e) {
            console.warn("Could not parse edited answer as JSON, saving as string.", e);
        }
        onSave({ ...card, question, answer: parsedAnswer });
    };

    return (
        <div className="edit-mode">
            <textarea className="edit-textarea" value={question} onChange={(e) => setQuestion(e.target.value)} />
            <textarea className="edit-textarea" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <div className="edit-actions">
                <button onClick={handleSave} className="edit-save-btn">Save</button>
                <button onClick={onCancel} className="edit-cancel-btn">Cancel</button>
            </div>
        </div>
    );
};

const FolderItem = ({
    folder,
    level = 0,
    allFoldersForMoveDropdown,
    onPlayGame,
    expandedFolderIds,
    handleFolderToggle,
    handleFolderDragStart,
    handleFolderDragOver,
    handleFolderDrop,
    handleFolderDragEnd,
    getSortedFolders,
    renderCardContent,
    setStudyingFolder,
    setModalConfig,
    setIsFeedbackModalOpen,
    setFlashNotesActionModal,
    setShowGamesModal,
    selectedCardsInExpandedFolder,
    handleSelectedCardInExpandedFolder,
    handleMoveSelectedCardsFromExpandedFolder,
    handleCardInFolderDragStart,
    handleCardInFolderDrop,
    isListening,
    stopListening,
    exportFolderToPDF,
    exportFolderToCSV,
    handleAddSubfolder,
    handleRenameFolder,
    handleDeleteFolder,
    findFolderById,
    folders,
    onStartExam,
    draggedFolderId
}) => {
    const [selectedFolderForMove, setSelectedFolderForMove] = useState('');
    const isExpanded = expandedFolderIds.has(folder.id);

    const countCardsRecursive = (currentFolder) => {
        let count = currentFolder.cards.length;
        for (const subfolderId in currentFolder.subfolders) {
            const sub = findFolderById(folders, subfolderId);
            if (sub) {
                count += countCardsRecursive(sub);
            }
        }
        return count;
    };

    return (
        <div
            key={folder.id}
            className={`folder ${draggedFolderId === folder.id ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => handleFolderDragStart(e, folder.id)}
            onDragOver={handleFolderDragOver}
            onDrop={(e) => handleFolderDrop(e, folder.id)}
            onDragEnd={handleFolderDragEnd}
            style={{ paddingLeft: `${level * 20}px` }}
        >
            <div
                className="folder-summary-custom"
                onClick={(e) => {
                    e.stopPropagation();
                    handleFolderToggle(folder.id, !isExpanded);
                }}
            >
                <div className="folder-item-header">
                    <span className="folder-name-display">
                        <span className={`folder-toggle-arrow ${isExpanded ? 'rotated' : ''}`}>▶</span>
                        {level > 0 && <span className="folder-icon">📁</span>}
                        {folder.name}
                        <span className="card-count-display"> ({countCardsRecursive(folder)} cards)</span>
                    </span>
                    <div className="folder-actions-right">
                        {!isExpanded && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setStudyingFolder({ id: folder.id, name: folder.name, cards: folder.cards });
                                }}
                                className="study-btn-small"
                            >
                                Study
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="folder-expanded-content">
                    <div className="folder-expanded-header">
                        <h3 className="folder-expanded-name">{folder.name}</h3>
                        <div className="folder-main-actions">
                            <button
                                onClick={() => {
                                    if (isListening) stopListening();
                                    setStudyingFolder({ id: folder.id, name: folder.name, cards: folder.cards });
                                    setModalConfig(null);
                                    setIsFeedbackModalOpen(false);
                                }}
                                className="study-btn-large"
                            >
                                Study
                            </button>
                            <button onClick={() => setFlashNotesActionModal(folder)} className="flash-notes-btn">Flash Notes</button>
                            <button onClick={() => setShowGamesModal(folder)} className="game-button-in-folder">Games</button>
                            <button onClick={() => onStartExam(folder)} className="exam-button-in-folder">Flash Exam</button>
                        </div>
                        {/* REFORMATTING ACTIONS BUTTON: */}
                        <div className="folder-expanded-actions">
                            <ActionsDropdown
                                folder={folder}
                                exportPdf={exportFolderToPDF}
                                exportCsv={exportFolderToCSV}
                                onAddSubfolder={(id) => {
                                    setModalConfig({ type: 'createFolder', title: 'Add Subfolder', onConfirm: (name) => handleAddSubfolder(id, name) });
                                }}
                                onRenameFolder={(id, name) => {
                                    setModalConfig({ type: 'prompt', title: 'Rename Folder', message: 'Enter new name for folder:', defaultValue: name, onConfirm: (newName) => handleRenameFolder(id, newName) });
                                }}
                                onDeleteFolder={(id) => {
                                    setModalConfig({ type: 'confirm', message: `Are you sure you want to delete "${findFolderById(folders, id)?.name}"? This will also delete all subfolders and cards within it.`, onConfirm: () => handleDeleteFolder(id) });
                                }}
                            />
                        </div>
                    </div>
                    {/* Subfolders will be rendered recursively from MainApp */}
                    <div className="folder-card-list">
                        {folder.cards.length > 0 ? folder.cards.map((card) => (
                            <div
                                key={card.id}
                                className="card saved-card-in-folder"
                                draggable
                                onDragStart={(e) => handleCardInFolderDragStart(e, card.id, folder.id)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleCardInFolderDrop(e, card.id, folder.id)}
                            >
                                <div className="card-selection">
                                    <input 
                                      type="checkbox" 
                                      checked={!!(selectedCardsInExpandedFolder[folder.id] && selectedCardsInExpandedFolder[folder.id][card.id])} 
                                      onChange={() => handleSelectedCardInExpandedFolder(folder.id, card.id)} 
                                    />
                                </div>
                                <div className="card-content">
                                    {renderCardContent(card, 'folder', folder.id)}
                                </div>
                            </div>
                        )) : <p className="subtle-text">No cards in this folder yet.</p>}
                    </div>
                     <div className="folder-card-actions">
                        <select className="folder-select" value={selectedFolderForMove} onChange={(e) => setSelectedFolderForMove(e.target.value)}>
                            <option value="" disabled>Move selected to...</option>
                            {allFoldersForMoveDropdown.map(f => f.id !== folder.id && <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                        <button
                            onClick={() => handleMoveSelectedCardsFromExpandedFolder(folder.id, selectedFolderForMove)}
                            className="move-to-folder-btn"
                            disabled={!Object.values(selectedCardsInExpandedFolder[folder.id] || {}).some(v => v) || !selectedFolderForMove}
                        >
                            Move Selected
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const MainApp = ({ showDocViewer, setShowDocViewer }) => {
    const [appMode, setAppMode] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [notification, setNotification] = useState('');
    const [duration, setDuration] = useState(15);
    const [generatedFlashcards, setGeneratedFlashcards] = useState([]);
    const [folders, setFolders] = useState({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileName, setFileName] = useState('');
    const [mediaSrc, setMediaSrc] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [mediaDuration, setMediaDuration] = useState(0);
    const [voiceActivated, setVoiceActivated] = useState(false);
    const [checkedCards, setCheckedCards] = useState({});
    const [editingCard, setEditingCard] = useState(null);
    const [studyingFolder, setStudyingFolder] = useState(null);
    const [promptModalConfig, setPromptModalConfig] = useState(null);
    const [selectedFolderForMove, setSelectedFolderForMove] = useState('');
    const [listeningDuration, setListeningDuration] = useState(1);
    const [isAutoFlashOn, setIsAutoFlashOn] = useState(false);
    const [autoFlashInterval, setAutoFlashInterval] = useState(20);
    const [isUploadAutoFlashOn, setIsUploadAutoFlashOn] = useState(false);
    const [uploadAutoFlashInterval, setUploadAutoFlashInterval] = useState(20);
    const [usage, setUsage] = useState({ count: 0, limit: 25, date: '' });
    const [isDevMode, setIsDevMode] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [audioCacheId, setAudioCacheId] = useState(null);
    const [folderSortBy, setFolderSortBy] = useState('name');
    const [draggedFolderId, setDraggedFolderId] = useState(null);
    const [expandedFolderIds, setExpandedFolderIds] = new useState(new Set());
    const [selectedCardsInExpandedFolder, setSelectedCardsInExpandedFolder] = useState({});
    const [imageSrc, setImageSrc] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [fotoCardCount, setFotoCardCount] = useState(5);
    const [modalConfig, setModalConfig] = useState(null);
    const [flashNotesActionModal, setFlashNotesActionModal] = useState(null);
    const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
    const [flashNotesContent, setFlashNotesContent] = useState(null);
    const [showFlashNotesViewer, setShowFlashNotesViewer] = useState(false);
    const [gameModeFolder, setGameModeFolder] = useState(null);
    const [gameLaunchedFromStudy, setGameLaunchedFromStudy] = useState(false);
    const [showGamesModal, setShowGamesModal] = useState(null);
    const [showAnamnesisNemesisLanding, setShowAnamnesisNemesisLanding] = useState(false);
    const [mostRecentScore, setMostRecentScore] = useState(null);
    const [isSafari, setIsSafari] = useState(false);
    const [examWizardState, setExamWizardState] = useState(null);
    const [examSelectedFolderIds, setExamSelectedFolderIds] = useState({});
    const [activeExam, setActiveExam] = useState(null);
    const [savedExams, setSavedExams] = useState([]);
    const [examHistory, setExamHistory] = useState([]);
    const audioChunksRef = useRef([]);
    const headerChunkRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const fileInputRef = useRef(null);
    const audioPlayerRef = useRef(null);
    const videoPlayerRef = useRef(null);
    const recognitionRef = useRef(null);
    const listeningTimeoutRef = useRef(null);
    const autoFlashTimerRef = useRef(null);
    const uploadAutoFlashTimerRef = useRef(null);
    const silenceTimeoutRef = useRef(null);
    const animationFrameRef = useRef(null);
    const fotoFileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [loadingState, setLoadingState] = useState({ isActive: false, message: '' });
    
    const isGeneratingRef = useRef(isGenerating);
    useEffect(() => { isGeneratingRef.current = isGenerating; }, [isGenerating]);

    const isAutoFlashOnRef = useRef(isAutoFlashOn);
    useEffect(() => { isAutoFlashOnRef.current = isAutoFlashOn; }, [isAutoFlashOn]);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const userAgent = navigator.userAgent;
        setIsSafari(/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent));
        if (queryParams.get('dev') === 'true') {
            setIsDevMode(true);
            setNotification('Developer mode active: Usage limit disabled.');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const storedUsageJSON = localStorage.getItem('flashfonic-usage');
        let currentUsage = { count: 0, limit: 25, date: today };

        if (storedUsageJSON) {
            const storedUsage = JSON.parse(storedUsageJSON);
            if (storedUsage.date === today) {
                currentUsage = storedUsage;
            } else {
                currentUsage = { ...storedUsage, count: 0, date: today };
            }
        }
        
        setUsage(currentUsage);
        localStorage.setItem('flashfonic-usage', JSON.stringify(currentUsage));
    }, []);

    useEffect(() => {
        try {
            const storedFolders = localStorage.getItem('flashfonic-folders');
            if (storedFolders) {
                const parsedFolders = JSON.parse(storedFolders);
                const convertFolderStructure = (oldFolders) => {
                    const newFolders = {};
                    for (const key in oldFolders) {
                        const folder = oldFolders[key];
                        let newFolder;
                        if (Array.isArray(folder)) {
                            const folderId = generateUUID();
                            newFolder = { id: folderId, name: key, createdAt: Date.now(), lastViewed: Date.now(), cards: folder, subfolders: {} };
                        } else {
                            newFolder = { ...folder };
                            if (!newFolder.id) newFolder.id = generateUUID();
                            if (!newFolder.createdAt) newFolder.createdAt = Date.now();
                            if (!newFolder.lastViewed) newFolder.lastViewed = Date.now();
                            if (!newFolder.cards) newFolder.cards = [];
                            if (!newFolder.subfolders) newFolder.subfolders = {};
                            if (newFolder.flashNotes === undefined) newFolder.flashNotes = null;
                            if (newFolder.leaderboard === undefined) newFolder.leaderboard = [];
                            newFolder.subfolders = convertFolderStructure(newFolder.subfolders);
                        }
                        newFolders[newFolder.id] = newFolder;
                    }
                    return newFolders;
                };
                setFolders(convertFolderStructure(parsedFolders));
            }
        } catch (error) {
            console.error("Error loading folders from local storage:", error);
            setFolders({});
            setNotification("Error loading saved data. Starting fresh.");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('flashfonic-folders', JSON.stringify(folders));
    }, [folders]);

    useEffect(() => {
        try {
            const storedExams = localStorage.getItem('flashfonic-saved-exams');
            if (storedExams) setSavedExams(JSON.parse(storedExams));
            const storedHistory = localStorage.getItem('flashfonic-exam-history');
            if (storedHistory) setExamHistory(JSON.parse(storedHistory));
        } catch (error) {
            console.error("Could not load exam data:", error);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('flashfonic-saved-exams', JSON.stringify(savedExams));
    }, [savedExams]);

    useEffect(() => {
        localStorage.setItem('flashfonic-exam-history', JSON.stringify(examHistory));
    }, [examHistory]);

const generateFlashcardRequest = useCallback(async (requestBody) => {
    setIsGenerating(true);
    setNotification('Generating flashcard...');
    try {
        const response = await fetch('https://flashfonic-backend-shewski.replit.app/generate-flashcard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate flashcard.');
        }

        let finalCardData = data;
        if (data.type === 'full_reaction') {
            finalCardData = {
                question: data.question,
                answer: data // The entire structured object is now the answer
            };
        }
        
        const newCard = { ...finalCardData, id: Date.now(), lastViewed: null, isFlagged: false };
        setGeneratedFlashcards(prev => [newCard, ...prev]);
        
        if (!isDevMode) {
            setUsage(prevUsage => {
                const newUsage = { ...prevUsage, count: prevUsage.count + 1 };
                localStorage.setItem('flashfonic-usage', JSON.stringify(newUsage));
                return newUsage;
            });
        }
        setNotification('Card generated!');
    } catch (error) {
        console.error("Error:", error);
        setNotification(`Error: ${error.message || 'Failed to connect to the backend server. Please try again later.'}`);
    } finally {
        setIsGenerating(false);
    }
}, [isDevMode]); // Keep dependencies as they are in your file

    const handleLiveFlashIt = useCallback(async () => {
        if (!isDevMode && usage.count >= usage.limit) {
            setNotification(`You have 0 cards left for today. Your limit will reset tomorrow.`);
            return;
        }
        if (isGeneratingRef.current) return;
        if (!headerChunkRef.current) {
            setNotification('Audio not ready. Wait a moment.');
            return;
        }

        const chunks = [...audioChunksRef.current];
        if (chunks.length < 3) {
            setNotification('Not enough audio captured.');
            return;
        }

        const grab = Math.min(duration, chunks.length);
        const slice = chunks.slice(-grab);
        const fileBlob = new Blob([headerChunkRef.current, ...slice], { type: mediaRecorderRef.current.mimeType });
        
        const reader = new FileReader();
        reader.readAsDataURL(fileBlob);
        reader.onloadend = () => {
            const base64Audio = reader.result.split(',')[1];
            generateFlashcardRequest({ audio_data: base64Audio, is_live_capture: true });
        };
    }, [duration, usage, isDevMode, generateFlashcardRequest]);

    const handleProcessAudio = useCallback(async () => {
        if (!uploadedFile) return;
        setIsProcessing(true);
        setNotification("Uploading and processing audio...");

        const reader = new FileReader();
        reader.readAsDataURL(uploadedFile);
        reader.onloadend = async () => {
            const base64File = reader.result.split(',')[1];
            try {
                const response = await fetch('https://flashfonic-backend-shewski.replit.app/process-audio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ audio_data: base64File })
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to process audio.');
                }
                
                setAudioCacheId(data.audioId);
                setNotification("Audio is ready! You can now flash it!");
            } catch (error) {
                console.error("Error processing audio:", error);
                setNotification(`Error: ${error.message || 'Failed to connect to the backend server. Please try again later.'}`);
            } finally {
                setIsProcessing(false);
            }
        };
    }, [uploadedFile]);

    const handleUploadFlash = useCallback(async () => {
        if (!isDevMode && usage.count >= usage.limit) {
            setNotification(`You have 0 cards left for today. Your limit will reset tomorrow.`);
            return;
        }
        if (isGeneratingRef.current) return;

        const activePlayer = fileType === 'video' ? videoPlayerRef.current : audioPlayerRef.current;
        const requestBody = {
            startTime: activePlayer.currentTime,
            duration: duration,
            is_live_capture: false,
        };

        if (audioCacheId) {
            requestBody.audioId = audioCacheId;
        } else {
            if (!uploadedFile) return;
            const reader = new FileReader();
            reader.readAsDataURL(uploadedFile);
            reader.onloadend = () => {
                const base64Audio = reader.result.split(',')[1];
                requestBody.audio_data = base64Audio;
                generateFlashcardRequest(requestBody);
            };
            return;
        }
        
        generateFlashcardRequest(requestBody);

    }, [uploadedFile, audioCacheId, duration, usage, isDevMode, fileType, generateFlashcardRequest]);

    useEffect(() => {
        if (autoFlashTimerRef.current) clearInterval(autoFlashTimerRef.current);
        autoFlashTimerRef.current = null;
        if (isListening && isAutoFlashOn) {
            autoFlashTimerRef.current = setInterval(handleLiveFlashIt, autoFlashInterval * 1000);
        }
        return () => clearInterval(autoFlashTimerRef.current);
    }, [isListening, isAutoFlashOn, autoFlashInterval, handleLiveFlashIt]);
    
    useEffect(() => {
        if (uploadAutoFlashTimerRef.current) clearInterval(uploadAutoFlashTimerRef.current);
        uploadAutoFlashTimerRef.current = null;
        if (appMode === 'upload' && isUploadAutoFlashOn && isPlaying && (fileType === 'audio' || audioCacheId)) {
            setNotification(`Auto-Flash started. Generating a card every ${formatAutoFlashInterval(uploadAutoFlashInterval)}.`);
            uploadAutoFlashTimerRef.current = setInterval(handleUploadFlash, uploadAutoFlashInterval * 1000);
        }
        return () => clearInterval(uploadAutoFlashTimerRef.current);
    }, [appMode, isUploadAutoFlashOn, isPlaying, uploadAutoFlashInterval, handleUploadFlash, fileType, audioCacheId]);


    const stopListening = useCallback(() => {
        if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);
        if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current.stop();
        streamRef.current?.getTracks().forEach(track => track.stop());
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        
        setIsListening(false);
        setNotification('');
    }, []);

    const startListening = useCallback(async () => {
        if (!isDevMode && usage.count >= usage.limit) {
            setNotification(`You have 0 cards left for today. Your limit will reset tomorrow.`);
            return;
        }
        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsListening(true);
            setNotification('Listening...');

            const mimeType = isSafari ? 'audio/mp4' : 'audio/webm; codecs=opus';
            mediaRecorderRef.current = new MediaRecorder(streamRef.current, { mimeType });
            
            audioChunksRef.current = [];
            headerChunkRef.current = null;

            mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                    if (!headerChunkRef.current) {
                        headerChunkRef.current = event.data;
                        
                        if (listeningDuration > 0) {
                            listeningTimeoutRef.current = setTimeout(() => {
                                if (isAutoFlashOnRef.current) {
                                    setNotification(`Listening timer finished. Generating final card...`);
                                    handleLiveFlashIt();
                                    setTimeout(() => stopListening(), 2500);
                                } else {
                                    setNotification(`Listening timer finished after ${formatListeningDuration(listeningDuration)}.`);
                                    stopListening();
                                }
                            }, listeningDuration * 60 * 1000);
                        }
                    }
                }
            });

            mediaRecorderRef.current.start(1000);

            if (voiceActivated && !isSafari) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (SpeechRecognition) {
                    recognitionRef.current = new SpeechRecognition();
                    recognitionRef.current.continuous = true;
                    recognitionRef.current.interimResults = true;
                    recognitionRef.current.onresult = (event) => {
                        for (let i = event.resultIndex; i < event.results.length; ++i) {
                            if (event.results[i].isFinal) {
                                const transcript = event.results[i][0].transcript.trim().toLowerCase();
                                if (transcript.includes("flash")) {
                                    console.log("Voice command 'flash' detected.");
                                    handleLiveFlashIt();
                                }
                            }
                        }
                    };
                    recognitionRef.current.start();
                }
            }

        } catch (err) {
            console.error("Error starting listening:", err);
            setNotification("Microphone access denied or error. Please check permissions and try again.");
            setIsListening(false);
        }
    }, [isDevMode, usage.count, usage.limit, isSafari, listeningDuration, voiceActivated, handleLiveFlashIt, stopListening]);

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setIsCameraOn(false);
    }, []);

    const handleModeChange = useCallback((mode) => {
        if (isListening) stopListening();
        if (isCameraOn) stopCamera();
        setAppMode(mode);
        setNotification('');
        setImageSrc(null);
        setAiAnalysis(null);
    }, [isListening, isCameraOn, stopListening, stopCamera]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setMediaSrc(null);
        setUploadedFile(file);
        setFileName(file.name);
        setCurrentTime(0);
        setMediaDuration(0);
        setAudioCacheId(null);
        
        if (file.type.startsWith('video/')) {
            setFileType('video');
        } else if (file.type.startsWith('audio/')) {
            setFileType('audio');
        } else {
            setNotification("Unsupported file type. Please upload an audio or video file.");
            return;
        }

        setMediaSrc(URL.createObjectURL(file));
        setNotification('File selected. Press play and then flash it!');
    };

    const triggerFileUpload = () => {
        fileInputRef.current.click();
    }

    useEffect(() => {
        const activePlayer = fileType === 'video' ? videoPlayerRef.current : audioPlayerRef.current;
        if (!activePlayer) return;

        const timeUpdate = () => setCurrentTime(activePlayer.currentTime);
        const loadedMeta = () => setMediaDuration(activePlayer.duration);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        activePlayer.addEventListener('timeupdate', timeUpdate);
        activePlayer.addEventListener('loadedmetadata', loadedMeta);
        activePlayer.addEventListener('play', onPlay);
        activePlayer.addEventListener('pause', onPause);
        activePlayer.addEventListener('ended', onPause);

        return () => {
            activePlayer.removeEventListener('timeupdate', timeUpdate);
            activePlayer.removeEventListener('loadedmetadata', loadedMeta);
            activePlayer.removeEventListener('play', onPlay);
            activePlayer.removeEventListener('pause', onPause);
            activePlayer.removeEventListener('ended', onPause);
        };
    }, [mediaSrc, fileType]);

    const togglePlayPause = () => {
        const activePlayer = fileType === 'video' ? videoPlayerRef.current : audioPlayerRef.current;
        if (activePlayer?.paused) {
            activePlayer.play();
        } else {
            activePlayer?.pause();
        }
    };

    const handleSeek = (e) => {
        const activePlayer = fileType === 'video' ? videoPlayerRef.current : audioPlayerRef.current;
        const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * mediaDuration;
        activePlayer.currentTime = seekTime;
    };
    
    const handleCardCheck = (cardId) => {
        setCheckedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
    };

    const handleCheckAll = () => {
        const allChecked = generatedFlashcards.every(card => checkedCards[card.id]);
        const newCheckedCards = {};
        if (!allChecked) {
            generatedFlashcards.forEach(card => {
                newCheckedCards[card.id] = true;
            });
        }
        setCheckedCards(newCheckedCards);
    };

    const findFolderById = useCallback((foldersObj, folderId) => {
        for (const id in foldersObj) {
            if (foldersObj[id].id === folderId) return foldersObj[id];
            const foundInSub = findFolderById(foldersObj[id].subfolders, folderId);
            if (foundInSub) return foundInSub;
        }
        return null;
    }, []);

    const updateFolderById = useCallback((foldersObj, folderId, updateFn) => {
        const newFolders = { ...foldersObj };
        for (const id in newFolders) {
            if (newFolders[id].id === folderId) {
                newFolders[id] = updateFn(newFolders[id]);
                return newFolders;
            }
            const updatedSubfolders = updateFolderById(newFolders[id].subfolders, folderId, updateFn);
            if (updatedSubfolders !== newFolders[id].subfolders) {
                newFolders[id] = { ...newFolders[id], subfolders: updatedSubfolders };
                return newFolders;
            }
        }
        return foldersObj;
    }, []);

    const deleteFolderById = useCallback((currentFolders, idToDelete) => {
        const newFolders = { ...currentFolders };
        if (newFolders[idToDelete]) {
            delete newFolders[idToDelete];
            return newFolders;
        }
        for (const id in newFolders) {
            const updatedSubfolders = deleteFolderById(newFolders[id].subfolders, idToDelete);
            if (updatedSubfolders !== newFolders[id].subfolders) {
                newFolders[id] = { ...newFolders[id], subfolders: updatedSubfolders };
                return newFolders;
            }
        }
        return currentFolders;
    }, []);

    const deleteCardFromFolder = useCallback((folderId, cardId) => {
        setFolders(prevFolders => updateFolderById(prevFolders, folderId, (folder) => ({
            ...folder,
            cards: folder.cards.filter(card => card.id !== cardId)
        })));
    }, [updateFolderById]);

    const deleteFromQueue = (cardId) => {
        setGeneratedFlashcards(prev => prev.filter(card => card.id !== cardId));
    };
    
    const handleMoveToFolder = useCallback(() => {
        const checkedCardIds = Object.keys(checkedCards).filter(id => checkedCards[id]);
        if (checkedCardIds.length === 0 || !selectedFolderForMove) {
            setNotification("Please select at least one card and a destination folder.");
            return;
        }

        const cardsToMove = generatedFlashcards.filter(card => checkedCards[card.id]);
        
        setFolders(prevFolders => updateFolderById(prevFolders, selectedFolderForMove, (folder) => ({
            ...folder,
            cards: [...folder.cards, ...cardsToMove]
        })));

        setGeneratedFlashcards(prev => prev.filter(card => !checkedCards[card.id]));
        setCheckedCards({});
        setNotification(`${cardsToMove.length} card(s) moved successfully.`);
    }, [checkedCards, generatedFlashcards, selectedFolderForMove, updateFolderById]);

    const handleCreateFolder = useCallback((folderName) => {
        const newFolderId = generateUUID();
        setFolders(prev => ({
            ...prev,
            [newFolderId]: {
                id: newFolderId,
                name: folderName,
                cards: [],
                subfolders: {},
                createdAt: Date.now(),
                lastViewed: Date.now(),
                flashNotes: null,
                leaderboard: []
            }
        }));
        setModalConfig(null);
    }, []);

    const handleAddSubfolder = useCallback((parentFolderId, subfolderName) => {
        const newSubfolderId = generateUUID();
        setFolders(prev => updateFolderById(prev, parentFolderId, (folder) => ({
            ...folder,
            subfolders: {
                ...folder.subfolders,
                [newSubfolderId]: {
                    id: newSubfolderId,
                    name: subfolderName,
                    cards: [],
                    subfolders: {},
                    createdAt: Date.now(),
                    lastViewed: Date.now(),
                    flashNotes: null,
                    leaderboard: []
                }
            }
        })));
        setModalConfig(null);
    }, [updateFolderById]);

    const handleRenameFolder = useCallback((folderId, newName) => {
        setFolders(prev => updateFolderById(prev, folderId, (folder) => ({
            ...folder,
            name: newName
        })));
        setModalConfig(null);
    }, [updateFolderById]);

    const handleDeleteFolder = useCallback((folderId) => {
        setFolders(prev => deleteFolderById(prev, folderId));
        setModalConfig(null);
    }, [deleteFolderById]);
    
    const startEditing = useCallback((card, source, folderId = null) => {
        setEditingCard({ ...card, source, folderId });
    }, []);

    const saveEdit = useCallback((updatedCard) => {
        if (!editingCard) return;
        const { source, folderId } = editingCard;
        const { id } = updatedCard;

        if (source === 'queue') {
            setGeneratedFlashcards(prev =>
                prev.map(card => card.id === id ? updatedCard : card)
            );
        } else if (source === 'folder' && folderId) {
            setFolders(prev => updateFolderById(prev, folderId, (folder) => ({
                ...folder,
                cards: folder.cards.map(card =>
                    card.id === id ? updatedCard : card
                )
            })));
        }
        setEditingCard(null);
    }, [editingCard, updateFolderById]);

    const renderCardContent = useCallback((card, source, folderId = null) => {
        if (editingCard && editingCard.id === card.id) {
            return (
                <EditableCardContent
                    card={editingCard}
                    onSave={saveEdit}
                    onCancel={() => setEditingCard(null)}
                />
            );
        }
        return (
            <>
                <div className="card-top-actions">
                    <button onClick={() => startEditing(card, source, folderId)} className="edit-btn">Edit</button>
                </div>
                <p><strong>Q:</strong> <ContentRenderer content={card.question} /></p>
                <p><strong>A:</strong> <ContentRenderer content={card.answer} reactionSummary={card.reactionSummary} /></p>
                <button onClick={() => {
                    if (source === 'queue') {
                        deleteFromQueue(card.id);
                    } else if (source === 'folder') {
                        deleteCardFromFolder(folderId, card.id);
                    }
                }} className="card-delete-btn">🗑️</button>
            </>
        );
    }, [editingCard, startEditing, saveEdit, deleteFromQueue, deleteCardFromFolder]);

    const formatListeningDuration = (minutes) => {
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
        return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
    };

    const sliderValueToMinutes = (value) => {
        if (value <= 5) return value;
        if (value <= 16) return 5 + (value - 5) * 5;
        return 60 + (value - 16) * 10;
    };

    const minutesToSliderValue = (minutes) => {
        if (minutes <= 5) return minutes;
        if (minutes <= 60) return 5 + (minutes - 5) / 5;
        return 16 + (minutes - 60) / 10;
    };

    const formatAutoFlashInterval = (seconds) => {
        if (seconds < 60) return `${seconds} seconds`;
        const minutes = seconds / 60;
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    const sliderToInterval = (value) => {
        if (value <= 4) return 20 + (value * 10);
        return 60 + (value - 4) * 30;
    };

    const intervalToSlider = (seconds) => {
        if (seconds <= 60) return (seconds - 20) / 10;
        return 4 + (seconds - 60) / 30;
    };

    const getSortedFolders = useCallback((folderObj) => {
        const folderArray = Object.values(folderObj);
        return folderArray.sort((a, b) => {
            if (folderSortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else if (folderSortBy === 'dateCreated') {
                return a.createdAt - b.createdAt;
            } else if (folderSortBy === 'lastViewed') {
                return b.lastViewed - a.lastViewed;
            }
            return 0;
        });
    }, [folderSortBy]);

    const handleFolderDragStart = (e, folderId) => {
        e.dataTransfer.setData("folderId", folderId);
        setDraggedFolderId(folderId);
    };

    const handleFolderDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleFolderDrop = (e, targetFolderId) => {
        e.preventDefault();
        const sourceFolderId = e.dataTransfer.getData("folderId");

        if (sourceFolderId === targetFolderId) {
            setDraggedFolderId(null);
            return;
        }

        setFolders(prevFolders => {
            let draggedItem = null;
            
            const findAndRemove = (currentFolders, idToRemove) => {
                const newFolders = { ...currentFolders };
                if (newFolders[idToRemove]) {
                    draggedItem = newFolders[idToRemove];
                    delete newFolders[idToRemove];
                    return newFolders;
                }
                for (const id in newFolders) {
                    const updatedSubfolders = findAndRemove(newFolders[id].subfolders, idToRemove);
                    if (draggedItem) {
                        newFolders[id] = { ...newFolders[id], subfolders: updatedSubfolders };
                        return newFolders;
                    }
                }
                return currentFolders;
            };
            
            let foldersWithoutSource = findAndRemove(prevFolders, sourceFolderId);
            
            if (!draggedItem) return prevFolders;
            
            const addToTarget = (currentFolders, idToFind, itemToAdd) => {
                const newFolders = { ...currentFolders };
                if (newFolders[idToFind]) {
                    newFolders[idToFind].subfolders = {
                        ...newFolders[idToFind].subfolders,
                        [itemToAdd.id]: itemToAdd
                    };
                    return newFolders;
                }
                for (const id in newFolders) {
                    const updatedSubfolders = addToTarget(newFolders[id].subfolders, idToFind, itemToAdd);
                    if (JSON.stringify(updatedSubfolders) !== JSON.stringify(newFolders[id].subfolders)) {
                        newFolders[id] = { ...newFolders[id], subfolders: updatedSubfolders };
                        return newFolders;
                    }
                }
                return currentFolders;
            };
            
            return addToTarget(foldersWithoutSource, targetFolderId, draggedItem);
        });
        
        setDraggedFolderId(null);
    };

    const handleFolderDragEnd = () => {
        setDraggedFolderId(null);
    };

    const handleFolderToggle = useCallback((folderId, isOpen) => {
        setExpandedFolderIds(prev => {
            const newSet = new Set(prev);
            if (isOpen) {
                newSet.add(folderId);
            } else {
                newSet.delete(folderId);
            }
            return newSet;
        });
        if (isOpen) {
            setFolders(prev => updateFolderById(prev, folderId, (folder) => ({
                ...folder,
                lastViewed: Date.now()
            })));
        }
    }, [updateFolderById]);

    
            // --- REFACTOR FIX: NEW STATE HANDLERS FOR MainApp ---

    const handleSelectedCardInExpandedFolder = (folderId, cardId) => {
        setSelectedCardsInExpandedFolder(prev => {
            const newFoldersSelection = JSON.parse(JSON.stringify(prev));
            if (!newFoldersSelection[folderId]) {
                newFoldersSelection[folderId] = {};
            }
            newFoldersSelection[folderId][cardId] = !newFoldersSelection[folderId][cardId];
            return newFoldersSelection;
        });
    };

    const handleMoveSelectedCardsFromExpandedFolder = (sourceFolderId, destFolderId) => {
        if (!sourceFolderId || !destFolderId) return;

        let cardsToMove = [];
        const sourceFolder = findFolderById(folders, sourceFolderId);
        
        if (!sourceFolder || !selectedCardsInExpandedFolder[sourceFolderId]) return;

        const selectedCardIds = Object.keys(selectedCardsInExpandedFolder[sourceFolderId]).filter(
            cardId => selectedCardsInExpandedFolder[sourceFolderId][cardId]
        );

        if (selectedCardIds.length === 0) return;

        cardsToMove = sourceFolder.cards.filter(card => selectedCardIds.includes(card.id.toString()));

        setFolders(prev => {
            let newFolders = { ...prev };
            // Add cards to destination
            newFolders = updateFolderById(newFolders, destFolderId, (folder) => ({
                ...folder,
                cards: [...folder.cards, ...cardsToMove]
            }));
            // Remove cards from source
            newFolders = updateFolderById(newFolders, sourceFolderId, (folder) => ({
                ...folder,
                cards: folder.cards.filter(card => !selectedCardIds.includes(card.id.toString()))
            }));
            return newFolders;
        });

        // Clear the selection state for the source folder
        setSelectedCardsInExpandedFolder(prev => {
            const newSelection = { ...prev };
            delete newSelection[sourceFolderId];
            return newSelection;
        });

        setNotification(`${cardsToMove.length} card(s) moved.`);
    };

    const handleCardInFolderDragStart = (e, cardId, folderId) => {
        e.dataTransfer.setData("cardId", cardId);
        e.dataTransfer.setData("sourceFolderId", folderId);
    };

    const handleCardInFolderDrop = useCallback((e, targetCardId, targetFolderId) => {
        e.preventDefault();
        const sourceCardId = e.dataTransfer.getData("cardId");
        const sourceFolderId = e.dataTransfer.getData("sourceFolderId");

        if (sourceFolderId !== targetFolderId) {
            return;
        }

        setFolders(prevFolders => updateFolderById(prevFolders, targetFolderId, (folder) => {
            const currentCards = [...folder.cards];
            
            const draggedIndex = currentCards.findIndex(card => card.id.toString() === sourceCardId.toString());
            const targetIndex = currentCards.findIndex(card => card.id.toString() === targetCardId.toString());

            if (draggedIndex === -1 || targetIndex === -1) {
                return folder;
            }

            const [removed] = currentCards.splice(draggedIndex, 1);
            currentCards.splice(targetIndex, 0, removed);

            return { ...folder, cards: currentCards };
        }));
    }, [updateFolderById]);

    const handleStudySessionEnd = useCallback((updatedDeck) => {
        if (studyingFolder && updatedDeck) {
            setFolders(prev => updateFolderById(prev, studyingFolder.id, (folder) => ({
                ...folder,
                cards: updatedDeck
            })));
        }
        setStudyingFolder(null);
    }, [studyingFolder, updateFolderById]);

    const handleGameEnd = useCallback((folderId, finalScore, playerName, levelName) => {
        const newScoreEntry = {
            id: Date.now(),
            name: playerName,
            score: finalScore,
            date: Date.now(),
            level: levelName
        };

        setFolders(prev => updateFolderById(prev, folderId, folder => {
            const newLeaderboard = [...(folder.leaderboard || []), newScoreEntry];
            newLeaderboard.sort((a, b) => b.score - a.score || b.date - a.date);
            return { ...folder, leaderboard: newLeaderboard.slice(0, 10) };
        }));
        
        setMostRecentScore(newScoreEntry);
    }, [updateFolderById]);

    const handlePlayGame = useCallback((folder) => {
        setMostRecentScore(null);
        setGameModeFolder({ ...folder });
        setGameLaunchedFromStudy(false);
    }, []);

    const handleLaunchAnamnesisNemesis = useCallback((folder) => {
        setMostRecentScore(null);
        setShowAnamnesisNemesisLanding(true);
        setShowGamesModal(null);
        setGameModeFolder({ ...folder });
    }, []);

    const handleStartAnamnesisNemesisGame = () => {
        setShowAnamnesisNemesisLanding(false);
        setNotification("Anamnesis Nemesis game started! (Placeholder)");
    };

    const getAllFoldersFlat = useCallback((foldersObj) => {
        let flatList = [];
        for (const id in foldersObj) {
            flatList.push(foldersObj[id]);
            flatList = flatList.concat(getAllFoldersFlat(foldersObj[id].subfolders));
        }
        return flatList;
    }, []);
    const allFoldersForMoveDropdown = getAllFoldersFlat(folders);

    // --- ADD THIS HELPER FUNCTION ---
const getAllCardsFromFolders = (folderIds, allFolders) => {
    let cards = [];
    const foldersToSearch = [...folderIds];
    const searchedIds = new Set();

    while (foldersToSearch.length > 0) {
        const currentId = foldersToSearch.shift();
        if (searchedIds.has(currentId)) continue;

        const folder = findFolderById(allFolders, currentId);
        if (folder) {
            cards.push(...folder.cards);
            searchedIds.add(currentId);
            // Add subfolders to the search queue
            const subfolderIds = Object.keys(folder.subfolders);
            foldersToSearch.push(...subfolderIds);
        }
    }
    return cards;
};

    const handleStartExam = () => {
        setExamWizardState({ stage: 'hub' });
    };

    const handleExamHubSelection = (selection) => {
        if (selection === 'create') {
            setExamWizardState({ stage: 'folder_selection' });
        } else if (selection === 'retake') {
            setExamWizardState({ stage: 'retake_selection' });
        } else if (selection === 'history') {
            setExamWizardState({ stage: 'history_view' });
        } else {
            setExamWizardState(null);
        }
    };

    const handleRetakeExam = (examId) => {
        const examToRetake = savedExams.find(e => e.id === examId);
        if (examToRetake) {
            setActiveExam(examToRetake);
            setExamWizardState(null);
        }
    };

    const handleExamFolderToggle = (folderId) => {
        setExamSelectedFolderIds(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }));
    };

    const handleProceedToExamConfig = () => {
        setExamWizardState({ stage: 'config_selection' });
    };

    const handleCreateExam = async (config) => {
        setExamWizardState(null);
        const selectedIds = Object.keys(examSelectedFolderIds).filter(id => examSelectedFolderIds[id]);
        if (selectedIds.length === 0) return;

        const allCards = getAllCardsFromFolders(selectedIds, folders);
        if (allCards.length === 0) {
            setNotification("There are no flashcards in the selected folders.");
            return;
        }

        setLoadingState({ isActive: true, message: 'Generating your Flash Exam with AI...' });
        setIsGenerating(true);

        try {
            const response = await fetch('https://flashfonic-backend-shewski.replit.app/create-exam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cards: allCards, config })
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to create exam.');
            }
            const data = await response.json();
            
            const newExam = { ...data.exam, id: Date.now(), config };
            setSavedExams(prev => [newExam, ...prev]);
            setActiveExam(newExam);
            setNotification(`Exam "${newExam.title}" created!`);
        } catch (error) {
            setNotification(`Error: ${error.message}`);
        } finally {
            setIsGenerating(false);
            setExamSelectedFolderIds({});
            setLoadingState({ isActive: false, message: '' });
        }
    };

    const handleSaveAndRecordExam = (examData, finalScore) => {
        const totalQuestions = examData.questions.length;
        const percentage = Math.round((finalScore / totalQuestions) * 100);

        setModalConfig({
            type: 'prompt',
            title: 'Save Exam & Record Score',
            message: 'Enter a name for this exam:',
            defaultValue: examData.title,
            onConfirm: (examName) => {
                // 1. Save the exam with the user's name for retaking
                const newSavedExam = { ...examData, title: examName, id: Date.now() };
                setSavedExams(prev => [newSavedExam, ...prev]);

                // 2. Save the score to history with the user's name
                const newHistoryEntry = {
                    id: newSavedExam.id, // Use the same ID for consistency
                    title: examName,
                    score: percentage,
                    date: new Date().toISOString(),
                };
                setExamHistory(prev => [newHistoryEntry, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
                
                setNotification(`Exam "${examName}" saved!`);
                setModalConfig(null);
            }
        });
    };

    const handleSaveExam = (examToSave) => {
	    setModalConfig({
		    type: 'prompt',
		    title: 'Save Exam',
		    message: 'Enter a name for this exam:',
		    defaultValue: examToSave.title,
		    onConfirm: (examName) => {
		        const newSavedExam = { ...examToSave, title: examName, id: Date.now() };
		        setSavedExams(prev => [newSavedExam, ...prev]);
		        setNotification(`Exam "${examName}" saved!`);
		        setModalConfig(null);
            }
        });
    };

    const handleCreateFlaggedFolder = (exam, flaggedQuestions) => {
        // 1. Collect all the unique source card IDs from the flagged questions
        const flaggedIndices = Object.keys(flaggedQuestions).filter(key => flaggedQuestions[key]);
        const sourceCardIds = new Set();
        
        flaggedIndices.forEach(index => {
            const question = exam.questions[index];
            if (question.sourceCardIds) {
                question.sourceCardIds.forEach(id => sourceCardIds.add(id));
            }
        });

        // 2. Find the full card objects for these IDs
        const allCardsInFolders = getAllCardsFromFolders(Object.keys(folders), folders);
        const flaggedCards = allCardsInFolders.filter(card => sourceCardIds.has(String(card.id)));

        if (flaggedCards.length === 0) {
            setNotification("No source cards found for the flagged questions.");
            return;
        }

        // 3. Use the existing "Create Folder" modal to get a name
        setModalConfig({
            type: 'createFolder',
            title: `Create Folder for Flagged Items (${flaggedCards.length})`,
            onConfirm: (folderName) => {
                const newFolderId = generateUUID();
                setFolders(prev => ({
                    ...prev,
                    [newFolderId]: {
                        id: newFolderId,
                        name: folderName,
                        cards: flaggedCards,
                        subfolders: {},
                        createdAt: Date.now(),
                        lastViewed: Date.now(),
                        flashNotes: null,
                        leaderboard: []
                    }
                }));
                setModalConfig(null);
                setNotification(`Successfully created folder "${folderName}" with ${flaggedCards.length} cards.`);
            }
        });
    };

    const handleCancelExamWizard = () => {
        setExamWizardState(null);
        setExamSelectedFolderIds({});
    };

    const handleGenerateNotes = async (folder, action, forceRegenerate = false) => {
        setFlashNotesActionModal(null);
        
        if (folder.flashNotes && !forceRegenerate) {
            if (action === 'view') {
                setFlashNotesContent({ folderName: folder.name, notes: folder.flashNotes });
                setShowFlashNotesViewer(true);
            } else if (action === 'export') {
                exportNotesToPDF(folder.name, folder.flashNotes);
            }
            return;
        }

        setLoadingState({ isActive: true, message: 'Synthesizing your Flash Notes with AI...' });
        setIsGeneratingNotes(true);
        try {
            const response = await fetch('https://flashfonic-backend-shewski.replit.app/generate-notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cards: folder.cards }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate notes.');
            }

            setFolders(prev => updateFolderById(prev, folder.id, f => ({ ...f, flashNotes: data.notes })));
            
            if (action === 'view') {
                setFlashNotesContent({ folderName: folder.name, notes: data.notes });
                setShowFlashNotesViewer(true);
            } else if (action === 'export') {
                exportNotesToPDF(folder.name, data.notes);
            }
            setNotification('Flash Notes generated!');
        } catch (error) {
            console.error("Error generating notes:", error);
            setNotification(`Error: ${error.message}`);
        } finally {
            setIsGeneratingNotes(false);
            setLoadingState({ isActive: false, message: '' });
        }
    };

    const exportNotesToPDF = (folderName, notes) => {
        const doc = new jsPDF();
        const pageW = doc.internal.pageSize.getWidth();
        const margin = 15;
        const maxWidth = pageW - (margin * 2);
        let currentY = 55;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(30);
        doc.setTextColor(139, 92, 246);
        doc.text("FLASHFONIC", pageW / 2, 20, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
        doc.setTextColor(31, 41, 55);
        doc.text("Listen. Flash it. Learn.", pageW / 2, 30, { align: 'center' });

        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.text(`Flash Notes: ${folderName}`, pageW / 2, 45, { align: 'center' });

        const checkPageBreak = (heightNeeded) => {
            if (currentY + heightNeeded > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                currentY = margin;
            }
        };

        const tokens = marked.lexer(notes);

        tokens.forEach(token => {
            if (token.type === 'heading') {
                checkPageBreak(15);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                const headingText = doc.splitTextToSize(token.text, maxWidth);
                doc.text(headingText, margin, currentY);
                currentY += (headingText.length * 5) + 4;
            }
            if (token.type === 'list') {
                token.items.forEach(item => {
                    checkPageBreak(10);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    doc.setTextColor(0, 0, 0);
                    const itemText = doc.splitTextToSize(`• ${item.text}`, maxWidth - 5);
                    doc.text(itemText, margin + 5, currentY);
                    currentY += (itemText.length * 4) + 2;
                });
            }
            if (token.type === 'paragraph') {
                checkPageBreak(10);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                const pText = doc.splitTextToSize(token.text, maxWidth);
                doc.text(pText, margin, currentY);
                currentY += (pText.length * 4) + 2;
            }
            if (token.type === 'space') {
                currentY += 5;
            }
        });

        doc.save(`${folderName}-FlashNotes.pdf`);
    };

// --- START REFACTORED PDF EXPORT FUNCTION ---
// This helper function sanitizes the content of a card so it can be correctly printed to a PDF.

// Replace your function with this final, robust version:

const renderContentForPdf = (content) => {
    // --- NEW: Logic to handle structured reactions for the PDF ---
    if (typeof content === 'object' && !Array.isArray(content) && content !== null && content.type === 'full_reaction') {
        // Helper to safely extract chemical names
        const extractName = (chemString) => {
            if (typeof chemString !== 'string') return '[Invalid Chemical]';
            const match = chemString.match(/CHEM\[(.*?)\]/);
            return match && match[1] ? match[1] : '[Unnamed Chemical]';
        };
        
        const reactants = Array.isArray(content.reactants) ? content.reactants.map(extractName).join(' + ') : '';
        const products = Array.isArray(content.products) ? content.products.map(extractName).join(' + ') : '';
        const reagents = Array.isArray(content.reagents) ? content.reagents.join(', ') : '';
        
        if (reagents) {
            return `${reactants} --[${reagents}]--> ${products}`;
        }
        return `${reactants} --> ${products}`;
    }

    // --- YOUR EXISTING CODE, NOW MADE SAFER ---

    // Handles simple molecule/reaction arrays
    if (Array.isArray(content)) {
        const textArray = content.map(item => {
            if (typeof item !== 'string') return '[Invalid Data]'; // Safety check
            const chemRegex = /CHEM\[(.*?)\]/;
            const match = item.match(chemRegex);
            // Safety check for the match result
            return match && typeof match[1] !== 'undefined' ? `[Structure of ${match[1] || 'Unnamed'}]` : item;
        });
        return textArray.join(' → ');
    }
    
    // Handles SMILES, LaTeX, and plain text strings
    if (typeof content === 'string') {
        let text = content;
        const smilesRegex = /SMILES\[(.*?)\]/g;
        const smilesReactionRegex = /SMILES\[(.*?)\]>>SMILES\[(.*?)\]/g;
        const latexRegex = /\$\$(.*?)\$\$/g;
        const inlineLatexRegex = /\$(.*?)\$/g;

        text = text.replace(smilesReactionRegex, '[Chemical Reaction]');
        text = text.replace(smilesRegex, '[Chemical Structure]');
        text = text.replace(latexRegex, '[Formula]');
        text = text.replace(inlineLatexRegex, '[Formula]');
        return text;
    }
    
    // Fallback for any other unknown data type
    if (!content) return ''; // Safety check for null or undefined
    return String(content);
};

// --- START REFACTORED PDF EXPORT FUNCTION ---

const exportFolderToPDF = useCallback((folderId) => {
    const folder = findFolderById(folders, folderId);
    if (!folder || folder.cards.length === 0) {
        setNotification("Folder not found or contains no cards for export.");
        return;
    }

    setModalConfig({
        type: 'prompt',
        title: 'Export to PDF',
        message: 'How many flashcards per page? (6, 8, or 10)',
        defaultValue: '8',
        onConfirm: async (value) => {
            setModalConfig(null);
            setNotification("Generating PDF... fetching images may take a moment.");

            const cardsPerPage = parseInt(value, 10);
            if (![6, 8, 10].includes(cardsPerPage)) {
                setNotification("Invalid number. Please choose 6, 8, or 10.");
                return;
            }
            
            const doc = new jsPDF();
            const cards = folder.cards;
            const pageW = doc.internal.pageSize.getWidth();
            const pageH = doc.internal.pageSize.getHeight();
            const layoutConfig = {
                6: { rows: 3, cols: 2, fontSize: 10, imgSize: 30, fontFactor: 3.5 },
                8: { rows: 4, cols: 2, fontSize: 9, imgSize: 25, fontFactor: 3.8 },
                10: { rows: 5, cols: 2, fontSize: 8, imgSize: 20, fontFactor: 4.0 },
            };
            const config = layoutConfig[cardsPerPage];
            const margin = 15;
            const cardW = (pageW - (margin * (config.cols + 1))) / config.cols;
            const cardH = (pageH - 40 - (config.rows * margin)) / config.rows;

            const drawHeader = () => {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(30);
                doc.setTextColor(139, 92, 246);
                doc.text("FLASHFONIC", pageW / 2, 20, { align: 'center' });
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(16);
                doc.setTextColor(31, 41, 55);
                doc.text("Listen. Flash it. Learn.", pageW / 2, 30, { align: 'center' });
            };

            const getImageAsBase64 = async (url) => {
                try {
                    const response = await fetch(url);
                    if (!response.ok) return null;
                    const blob = await response.blob();
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                } catch (e) { return null; }
            };

            const drawCardContent = async (content, prefix, x, y, w, h) => {
                doc.setFontSize(config.fontSize);
                doc.setTextColor(0, 0, 0);

                let isChemical = (typeof content === 'object' && content !== null) || (typeof content === 'string' && content.includes('CHEM['));
                
                if (!isChemical) {
                    const fullText = `${prefix} ${renderContentForPdf(content)}`;
                    const textLines = doc.splitTextToSize(fullText, w - 10);
                    const textHeight = textLines.length * (config.fontSize / config.fontFactor);
                    const textY = y + (h / 2) - (textHeight / 2);
                    doc.text(textLines, x + w / 2, textY, { align: 'center' });
                    return;
                }
                
                let structure = { reactants: [], products: [], reagents: [] };
                if (content && content.type === 'full_reaction') {
                    structure = content;
                } else if (Array.isArray(content)) {
                    structure.products = content;
                }
                
                // --- AUTO-SCALING LOGIC ---
                let imgSize = config.imgSize;
                let plusSignWidth = 5;
                let arrowZoneWidth = 20;

                let totalContentWidth = (structure.reactants.length * imgSize) + Math.max(0, structure.reactants.length - 1) * plusSignWidth +
                                      ((structure.reactants.length > 0) ? arrowZoneWidth : 0) +
                                      (structure.products.length * imgSize) + Math.max(0, structure.products.length - 1) * plusSignWidth;
                
                if (totalContentWidth > w - 10) {
                    const scaleFactor = (w - 10) / totalContentWidth;
                    imgSize *= scaleFactor;
                    plusSignWidth *= scaleFactor;
                    arrowZoneWidth *= scaleFactor;
                }
                // Recalculate width with new scaled sizes for centering
                totalContentWidth = (structure.reactants.length * imgSize) + Math.max(0, structure.reactants.length - 1) * plusSignWidth +
                                  ((structure.reactants.length > 0) ? arrowZoneWidth : 0) +
                                  (structure.products.length * imgSize) + Math.max(0, structure.products.length - 1) * plusSignWidth;

                let currentX = x + (w - totalContentWidth) / 2;
                const contentY = y + (h - imgSize) / 2;

                doc.text(prefix, x + 5, y + 7);

                for (let i = 0; i < structure.reactants.length; i++) {
                    const match = structure.reactants[i].match(/CHEM\[(.*?)\]/);
                    if (match && match[1]) {
                        const url = `https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(match[1])}/image?format=jpg`;
                        const imgData = await getImageAsBase64(url);
                        if (imgData) doc.addImage(imgData, 'JPEG', currentX, contentY, imgSize, imgSize);
                    }
                    currentX += imgSize;
                    if (i < structure.reactants.length - 1) {
                        doc.text('+', currentX + plusSignWidth / 2, y + h / 2, { align: 'center', baseline: 'middle' });
                        currentX += plusSignWidth;
                    }
                }

                if (structure.reactants.length > 0) {
                    const arrowX = currentX + (arrowZoneWidth / 2);
                    doc.setFontSize(config.fontSize * 0.8);
                    doc.text(structure.reagents.join(', '), arrowX, y + (h / 2) - 5, { align: 'center' });
                    doc.setFontSize(config.fontSize * 1.5);
                    doc.text('-->', arrowX, y + h / 2 + 2, { align: 'center', baseline: 'middle' }); // Universal Arrow
                    currentX += arrowZoneWidth;
                }

                for (let i = 0; i < structure.products.length; i++) {
                    const match = structure.products[i].match(/CHEM\[(.*?)\]/);
                    if (match && match[1]) {
                        const url = `https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(match[1])}/image?format=jpg`;
                        const imgData = await getImageAsBase64(url);
                        if (imgData) doc.addImage(imgData, 'JPEG', currentX, contentY, imgSize, imgSize);
                    }
                    currentX += imgSize;
                    if (i < structure.products.length - 1) {
                        doc.text('+', currentX + plusSignWidth / 2, y + h / 2, { align: 'center', baseline: 'middle' });
                        currentX += plusSignWidth;
                    }
                }
            };

            for (const side of ['front', 'back']) {
                if (side === 'back' && cards.length > 0) doc.addPage();
                drawHeader();

                for (let i = 0; i < cards.length; i++) {
                    const pageIndex = Math.floor(i / cardsPerPage);
                    if (pageIndex > 0 && i % cardsPerPage === 0) {
                        doc.addPage();
                        drawHeader();
                    }
                    const card = cards[i];
                    const cardIndexOnPage = i % cardsPerPage;
                    const row = Math.floor(cardIndexOnPage / config.cols);
                    const col = cardIndexOnPage % config.cols;
                    const cardX = margin + (col * (cardW + margin));
                    const cardY = 40 + (row * (cardH + margin));

                    doc.setDrawColor(0);
                    doc.rect(cardX, cardY, cardW, cardH);
                    
                    const contentToDraw = side === 'front' ? card.question : card.answer;
                    const prefix = side === 'front' ? 'Q:' : 'A:';
                    await drawCardContent(contentToDraw, prefix, cardX, cardY, cardW, cardH);
                }
            }
            
            doc.save(`${folder.name}-flashcards.pdf`);
            setNotification("PDF generated successfully!");
        },
        onClose: () => setModalConfig(null)
    });
}, [folders, findFolderById]);
// --- END REFACTORED PDF EXPORT FUNCTION ---
    
    const exportFolderToCSV = useCallback((folderId) => {
        const folder = findFolderById(folders, folderId);
        if (!folder || folder.cards.length === 0) {
            setNotification("Folder not found or contains no cards for export.");
            return;
        }

        setStudyingFolder(null);
        setIsFeedbackModalOpen(false);

        setTimeout(() => {
            setModalConfig({
                type: 'prompt',
                title: 'Export to CSV',
                message: 'How many flashcards do you want to export?',
                defaultValue: folder.cards.length.toString(),
                onConfirm: (value) => {
                    const numCards = parseInt(value, 10);
                    if (isNaN(numCards) || numCards <= 0 || numCards > folder.cards.length) {
                        setNotification(`Invalid number. Please enter a number between 1 and ${folder.cards.length}.`);
                        return;
                    }
                    const cardsToExport = folder.cards.slice(0, numCards);
                    
                    let csvContent = "FlashFonic\nListen. Flash it. Learn.\n\n";
                    csvContent += "Question,Answer\n";
                    cardsToExport.forEach(card => {
                        const escapedQuestion = `"${card.question.replace(/"/g, '""')}"`;
                        const escapedAnswer = `"${JSON.stringify(card.answer).replace(/"/g, '""')}"`;
                        csvContent += `${escapedQuestion},${escapedAnswer}\n`;
                    });
                    
                    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `${folder.name}-flashcards.csv`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                    setNotification(`Exported ${numCards} cards to ${folder.name}-flashcards.csv`);
                    setModalConfig(null);
                },
                onClose: () => {
                    setModalConfig(null);
                }
            });
        }, 0);
    }, [folders, findFolderById]);

    const handleFotoFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result.split(',')[1];
                setImageSrc(reader.result);
                analyzeImage(base64data);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const startCamera = async () => {
        if (!videoRef.current) {
            console.error("Video element ref is not available yet.");
            setNotification("Camera could not be initialized. Please try again.");
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            videoRef.current.srcObject = stream;
            setIsCameraOn(true);
            setNotification('Camera is on. Snap a picture of your notes!');
        } catch (err) {
            console.warn("Environment camera not found or failed, trying default camera.", err);
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                setIsCameraOn(true);
                setNotification('Camera is on. Snap a picture of your notes!');
            } catch (finalErr) {
                console.error("Error accessing any camera:", finalErr);
                setNotification("Camera access denied or error. Please check permissions and ensure no other app is using it.");
            }
        }
    };
    
    const takePicture = () => {
        if (!videoRef.current || !canvasRef.current) return;
    
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
    
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
        
        stopCamera();
        setImageSrc(imageDataUrl);
        const base64Image = imageDataUrl.split(',')[1];
        analyzeImage(base64Image);
    };
    
    const analyzeImage = async (base64Image) => {
        setIsGenerating(true);
        setNotification('Analyzing image with AI...');
        setAiAnalysis(null);
        try {
            const response = await fetch('https://flashfonic-backend-shewski.replit.app/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_data: base64Image }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to analyze image.');
            
            setAiAnalysis({
                recommendation: data.recommendation,
                extractedText: data.extractedText
            });
            setNotification(`AI recommends generating ${data.recommendation} cards. Confirm or adjust the number.`);
        } catch (error) {
            console.error("Error analyzing image:", error);
            setNotification(`Error: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateFotoCards = async (count) => {
        if (!isDevMode && usage.count >= usage.limit) {
            setNotification(`You have 0 cards left for today. Your limit will reset tomorrow.`);
            return;
        }

        setIsGenerating(true);
        setNotification('Generating flashcards from notes...');
        const textToProcess = aiAnalysis.extractedText;
        setAiAnalysis(null);
        setImageSrc(null);
        try {
            const response = await fetch('https://flashfonic-backend-shewski.replit.app/generate-flashcards-from-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToProcess, cardCount: count }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to generate flashcards.');
            
            const newCards = data.cards.map(card => ({ ...card, id: Date.now() + Math.random(), lastViewed: null, isFlagged: false }));
            setGeneratedFlashcards(prev => [...newCards, ...prev]);

            if (!isDevMode) {
                setUsage(prevUsage => {
                    const newUsage = { ...prevUsage, count: prevUsage.count + newCards.length };
                    localStorage.setItem('flashfonic-usage', JSON.stringify(newUsage));
                    return newUsage;
                });
            }
            
            setNotification(`${newCards.length} flashcards generated!`);
        } catch (error) {
            console.error("Error generating flashcards from image:", error);
            setNotification(`Error: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleCancelUpload = () => {
        setMediaSrc(null);
        setUploadedFile(null);
        setFileName('');
        setCurrentTime(0);
        setMediaDuration(0);
        setAudioCacheId(null);
        setFileType(null);
        setIsUploadAutoFlashOn(false);
        setNotification('');
    };

    return (
        <>
            {studyingFolder && (
                <FlashcardViewer
                    key={studyingFolder.id}
                    folder={studyingFolder}
                    onClose={handleStudySessionEnd}
                    onLaunchGame={(folder) => {
                        setStudyingFolder(null);
                        handlePlayGame(folder);
                    }}
                    onLaunchAnamnesisNemesis={(folder) => {
                        setStudyingFolder(null);
                        handleLaunchAnamnesisNemesis(folder);
                    }}
                />
            )}

            {gameModeFolder && !showAnamnesisNemesisLanding && (
                <GameViewer
                    isSafari={isSafari}
                    key={gameModeFolder.id}
                    folder={gameModeFolder}
                    onClose={handleGameEnd}
                    onBackToStudy={(folder) => {
                        setGameModeFolder(null);
                        setStudyingFolder(folder);
                    }}
                    onExitGame={() => setGameModeFolder(null)}
                    cameFromStudy={gameLaunchedFromStudy}
                    mostRecentScore={mostRecentScore}
                />
            )}

            {activeExam && (
                <ExamViewer
                    exam={activeExam}
                    onClose={() => setActiveExam(null)}
                    onCreateFlaggedFolder={handleCreateFlaggedFolder} 
                    onSaveExam={handleSaveExam}
                    onSaveAndRecord={handleSaveAndRecordExam}
                />
            )}

            {showAnamnesisNemesisLanding && gameModeFolder && (
                <AnamnesisNemesisLandingPage
                    onClose={() => {setShowAnamnesisNemesisLanding(false); setShowGamesModal(gameModeFolder);}}
                    onStartGame={handleStartAnamnesisNemesisGame}
                />
            )}

            {modalConfig && modalConfig.type === 'prompt' && (
                <PromptModal
                    title={modalConfig.title}
                    message={modalConfig.message}
                    defaultValue={modalConfig.defaultValue}
                    onConfirm={modalConfig.onConfirm}
                    onClose={() => setModalConfig(null)}
                />
            )}
            {modalConfig && modalConfig.type === 'createFolder' && ( <CreateFolderModal onClose={() => setModalConfig(null)} onCreate={modalConfig.onConfirm} title={modalConfig.title} /> )}
            {modalConfig && modalConfig.type === 'confirm' && ( <ConfirmModal onClose={() => setModalConfig(null)} onConfirm={modalConfig.onConfirm} message={modalConfig.message} /> )}
            {isFeedbackModalOpen && <FeedbackModal onClose={() => setIsFeedbackModalOpen(false)} />}
            {modalConfig && modalConfig.type === 'flashFonicMode' && (
                <FlashFonicModeModal
                    onClose={() => setModalConfig(null)}
                    onSelect={(mode) => {
                        handleModeChange(mode);
                        setModalConfig(null);
                    }}
                />
            )}
            {modalConfig && modalConfig.type === 'imageSource' && (
                <ImageSourceModal
                    onClose={() => setModalConfig(null)}
                    onSelect={(source) => {
                        if (source === 'camera') {
                            startCamera();
                        } else {
                            fotoFileInputRef.current.click();
                        }
                        setModalConfig(null);
                    }}
                />
            )}

            
            {flashNotesActionModal && (
                <FlashNotesActionModal
                    folder={flashNotesActionModal}
                    onClose={() => setFlashNotesActionModal(null)}
                    onGenerate={handleGenerateNotes}
                    isGenerating={isGeneratingNotes}
                />
            )}
            {showFlashNotesViewer && flashNotesContent && (
                <FlashNotesViewer
                    folderName={flashNotesContent.folderName}
                    notes={flashNotesContent.notes}
                    onClose={() => setShowFlashNotesViewer(false)}
                />
            )}

            {showGamesModal && (
                <GamesModal
                    folder={showGamesModal}
                    onClose={() => setShowGamesModal(null)}
                    onLaunchGame={(folder) => {
                        setShowGamesModal(null);
                        handlePlayGame(folder);
                    }}
                    onLaunchAnamnesisNemesis={handleLaunchAnamnesisNemesis}
                />
            )}
            {loadingState.isActive && (
                <ProgressModal message={loadingState.message} />
            )}

            {examWizardState?.stage === 'hub' && (
                <ExamHubModal onSelect={handleExamHubSelection} />
            )}
            {examWizardState?.stage === 'folder_selection' && (
                <ExamFolderSelectionModal
                    allFolders={getSortedFolders(folders)}
                    selectedFolderIds={examSelectedFolderIds}
                    onToggleFolder={handleExamFolderToggle}
                    onNext={handleProceedToExamConfig}
                    onClose={() => setExamWizardState({ stage: 'hub' })}
                />
            )}
            {examWizardState?.stage === 'config_selection' && (
                <ExamConfigModal
                    onConfirm={handleCreateExam}
                    onClose={() => setExamWizardState({ stage: 'folder_selection' })}
                />
            )}
            {examWizardState?.stage === 'retake_selection' && (
                <RetakeExamModal
                    savedExams={savedExams}
                    onRetake={handleRetakeExam}
                    onClose={() => setExamWizardState({ stage: 'hub' })}
                />
            )}
            {examWizardState?.stage === 'history_view' && (
                <ExamHistoryModal
                    examHistory={examHistory}
                    onClose={() => setExamWizardState({ stage: 'hub' })}
                />
            )}

            {appMode === 'foto' ? (
                <div className="flashfoto-header">
                    <h1>FlashFoto</h1>
                    <div className="sub-brand">by FlashFonic<span style={{fontSize: '0.6em', verticalAlign: 'super'}}>™</span></div>
                    <h2 className="subheading">Snap it. Flash it. Learn.</h2>
                </div>
            ) : (
                <div className="header">
                    <h1>FlashFonic<span style={{fontSize: '0.6em', verticalAlign: 'super'}}>™</span></h1>
                    <h2 className="subheading">Listen. Flash it. Learn.</h2>
                </div>
            )}
            <div className="flashcount-container">
                <div className="usage-counter-new">
                    <span className="counter-label">Flashcount: </span>
                    {isDevMode ? (
                        <span className="counter-value">unlimited</span>
                    ) : (
                        <span className="counter-value">{usage.limit - usage.count} cards <span className="counter-suffix">(Free Trial)</span></span>
                    )}
                </div>
            </div>
            <div className="main-mode-selector">
                <button 
                    onClick={() => setModalConfig({ type: 'flashFonicMode' })} 
                    className={`create-folder-btn ${(appMode === 'live' || appMode === 'upload') ? 'active' : ''}`}
                >
                    FlashFonic
                </button>
                <button 
                    onClick={() => handleModeChange('foto')} 
                    className={`create-folder-btn ${appMode === 'foto' ? 'active' : ''}`}
                >
                    FlashFoto
                </button>
            </div>
            
            {appMode && (
                <div className="card main-controls" style={{position: 'relative'}}>
                    <div className="controls-header">
                    </div>
                    {appMode === 'live' ? (
                        <>
                            <div className="voice-hint" style={{marginBottom: '1.5rem'}}>
                                <ol>
                                    <li>Choose a listening duration using the slider below.</li>
                                    <li>Click "Start Listening" to begin capturing audio.</li>
                                    <li>Hit "Flash It!" to create a card, or use the voice/auto features.</li>
                                </ol>
                            </div>
                            <div className="listening-control">
                                <button onClick={isListening ? stopListening : startListening} className={`start-stop-btn ${isListening ? 'active' : ''}`}>{isListening ? '■ Stop Listening' : '● Start Listening'}</button>
                            </div>
                            <div className="listening-modes">
                                <button
                                    onClick={() => setVoiceActivated(!voiceActivated)}
                                    className={`voice-activate-btn ${voiceActivated ? 'active' : ''}`}
                                    disabled={isSafari}
                                    title={isSafari ? "Voice activation is not supported on Safari." : "Activate voice commands"}
                                >
                                    Voice Activate
                                </button>
                                <button onClick={() => setIsAutoFlashOn(!isAutoFlashOn)} className={`autoflash-btn ${isAutoFlashOn ? 'active' : ''}`}>
                                    Auto-Flash <span className="beta-tag">Beta</span>
                                </button>
                            </div>
                            
                            {(() => {
                                if (voiceActivated && isAutoFlashOn) {
                                    return (
                                        <div className="voice-hint">
                                            <p>🎤 Say "flash" to create a card.</p>
                                            <p>⚡ Automatically creating a card every {formatAutoFlashInterval(autoFlashInterval)}.</p>
                                        </div>
                                    );
                                } else if (voiceActivated) {
                                    return <p className="voice-hint">🎤 Say "flash" to create a card.</p>;
                                } else if (isAutoFlashOn) {
                                    return <p className="voice-hint">⚡ Automatically creating a card every {formatAutoFlashInterval(autoFlashInterval)}.</p>;
                                }
                                return null;
                            })()}

                            <div className="slider-container">
                                <label htmlFor="timer-slider" className="slider-label">Listening Duration: <span className="slider-value">{formatListeningDuration(listeningDuration)}</span></label>
                                <input id="timer-slider" type="range" min="1" max="22" step="1" value={minutesToSliderValue(listeningDuration)} onChange={(e) => setListeningDuration(sliderValueToMinutes(Number(e.target.value)))} disabled={isListening} />
                            </div>
                            {isAutoFlashOn && (
                                <div className="slider-container">
                                <label htmlFor="autoflash-slider" className="slider-label">Auto-Flash Interval: <span className="slider-value">{formatAutoFlashInterval(autoFlashInterval)}</span></label>
                                <input id="autoflash-slider" type="range" min="0" max="8" step="1" value={intervalToSlider(autoFlashInterval)} onChange={(e) => setAutoFlashInterval(sliderToInterval(Number(e.target.value)))} disabled={isListening} />
                                </div>
                            )}
                            <div className="slider-container">
                                <label htmlFor="duration-slider" className="slider-label">Capture Last: <span className="slider-value">{duration} seconds of audio</span></label>
                                <input id="duration-slider" type="range" min="5" max="30" step="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} disabled={isListening} />
                            </div>
                            <button
                                onClick={handleLiveFlashIt}
                                className={`flash-it-button ${isListening && !isGenerating && !isAutoFlashOn ? 'animated' : ''}`}
                                disabled={!isListening || isGenerating || isAutoFlashOn || (!isDevMode && usage.count >= usage.limit)}>
                                {isGenerating ? 'Generating...' : '⚡ Flash It!'}
                            </button>
                        </>
                    ) : appMode === 'upload' ? (
                        <>
                            <div className="voice-hint" style={{marginBottom: '1.5rem'}}>
                                <ol>
                                    <li>Click "Select File" to upload an audio or video.</li>
                                    <li>Play the media, then hit "Flash It!" to create a card.</li>
                                </ol>
                            </div>
                            <div className="upload-button-container">
                                <button onClick={triggerFileUpload}>{fileName ? 'Change File' : 'Select File'}</button>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*,video/*" style={{ display: 'none' }} />
                            {fileName && <p className="file-name-display">Selected: {fileName}</p>}
                            
                            {mediaSrc && (
                                <>
                                    <div className="upload-cancel-container">
                                        <button onClick={handleCancelUpload} className="cancel-upload-btn">Cancel Upload</button>
                                    </div>
                                    <div className="player-container">
                                        {fileType === 'video' ? (
                                            <>
                                                <video
                                                    ref={videoPlayerRef}
                                                    src={mediaSrc}
                                                    playsInline
                                                    className="video-player"
                                                    onClick={togglePlayPause}
                                                >
                                                </video>
                                                <div className="audio-player">
                                                    <button onClick={togglePlayPause} className="play-pause-btn">{isPlaying ? '❚❚' : '▶'}</button>
                                                    <div className="progress-bar-container" onClick={handleSeek}>
                                                        <div className="progress-bar" style={{ width: `${(currentTime / mediaDuration) * 100}%` }}></div>
                                                    </div>
                                                    <span className="time-display">{formatTime(currentTime)} / {formatTime(mediaDuration)}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="audio-player">
                                                <audio ref={audioPlayerRef} src={mediaSrc} />
                                                <button onClick={togglePlayPause} className="play-pause-btn">{isPlaying ? '❚❚' : '▶'}</button>
                                                <div className="progress-bar-container" onClick={handleSeek}>
                                                    <div className="progress-bar" style={{ width: `${(currentTime / mediaDuration) * 100}%` }}></div>
                                                </div>
                                                <span className="time-display">{formatTime(currentTime)} / {formatTime(mediaDuration)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="listening-modes" style={{marginTop: '1rem'}}>
                                        {fileType === 'video' && !audioCacheId && (
                                            <button
                                                onClick={handleProcessAudio}
                                                className="autoflash-btn"
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? 'Processing...' : '🎧 Process Audio from Video'}
                                            </button>
                                        )}
                                        <button onClick={() => setIsUploadAutoFlashOn(!isUploadAutoFlashOn)} className={`autoflash-btn ${isUploadAutoFlashOn ? 'active' : ''}`} disabled={fileType === 'video' && !audioCacheId}>
                                            Auto-Flash <span className="beta-tag">Beta</span>
                                        </button>
                                    </div>
                                    
                                    {isUploadAutoFlashOn && (fileType === 'audio' || audioCacheId) && (
                                        <>
                                            <div className="slider-container">
                                                <label htmlFor="upload-autoflash-slider" className="slider-label">Auto-Flash Interval: <span className="slider-value">{formatAutoFlashInterval(uploadAutoFlashInterval)}</span></label>
                                                <input id="upload-autoflash-slider" type="range" min="0" max="8" step="1" value={intervalToSlider(uploadAutoFlashInterval)} onChange={(e) => setUploadAutoFlashInterval(sliderToInterval(Number(e.target.value)))} disabled={isPlaying && isUploadAutoFlashOn} />
                                            </div>
                                            <p className="voice-hint" style={{marginTop: '1rem'}}>⚡ Automatically creating a card every {formatAutoFlashInterval(uploadAutoFlashInterval)}.</p>
                                        </>
                                    )}
                                </>
                            )}
                            <div className="slider-container" style={{ marginTop: '1rem' }}>
                                <label htmlFor="duration-slider-upload" className="slider-label">Capture Last: <span className="slider-value">{duration} seconds of audio</span></label>
                                <input id="duration-slider-upload" type="range" min="5" max="30" step="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                            </div>
                            <button
                                onClick={handleUploadFlash}
                                className={`flash-it-button ${mediaSrc && !isGenerating && !(isUploadAutoFlashOn && isPlaying) ? 'animated' : ''}`}
                                disabled={!mediaSrc || isGenerating || (fileType === 'video' && !audioCacheId) || (isUploadAutoFlashOn && isPlaying) || (!isDevMode && usage.count >= usage.limit)}
                            >
                                {isGenerating ? 'Generating...' : '⚡ Flash It!'}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="voice-hint" style={{marginBottom: '1.5rem'}}>
                                <ol>
                                    <li>Choose your default number of flashcards via the slider below.</li>
                                    <li>Snap a photo or upload an image of your notes.</li>
                                </ol>
                            </div>
                            <div className="image-preview-container">
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'contain', display: isCameraOn ? 'block' : 'none' }} />
                                {imageSrc && !isCameraOn && <img src={imageSrc} alt="Preview" />}
                                {!imageSrc && !isCameraOn && !isGenerating && (
                                    <div className="image-preview-placeholder"><p>Upload or capture an image of your notes</p></div>
                                )}
                                {isGenerating && (
                                    <div className="image-preview-placeholder"><p>AI is working...</p></div>
                                )}
                            </div>
                            <div className="flashfoto-controls">
                                {!isCameraOn && !imageSrc ? (
                                    <button onClick={() => setModalConfig({ type: 'imageSource' })} className="start-stop-btn">Snap or Upload Photo</button>
                                ) : isCameraOn ? (
                                    <>
                                        <button onClick={takePicture} className="start-stop-btn active">📸 Snap It!</button>
                                        <button onClick={stopCamera} className="start-stop-btn cancel-action">Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => {
                                        setImageSrc(null);
                                        setAiAnalysis(null);
                                        setNotification('');
                                    }} className="start-stop-btn cancel-action">Clear Image</button>
                                )}
                                <input type="file" ref={fotoFileInputRef} onChange={handleFotoFileChange} accept="image/*" style={{ display: 'none' }} />
                            </div>
                            {aiAnalysis && (
                                <div className="ai-recommendation">
                                    <p>FlashFonic recommends <strong>{aiAnalysis.recommendation}</strong> flashcards. Do you agree?</p>
                                    <div className="ai-recommendation-actions">
                                        <button onClick={() => handleGenerateFotoCards(aiAnalysis.recommendation)} disabled={isGenerating}>Capture as Recommended</button>
                                        <button onClick={() => handleGenerateFotoCards(fotoCardCount)} disabled={isGenerating}>Capture {fotoCardCount} Flashcards</button>
                                        <button onClick={() => setAiAnalysis(null)} className="modal-create-btn danger">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="slider-container">
                                <label htmlFor="foto-card-slider" className="slider-label">Number of Flashcards: <span className="slider-value">{fotoCardCount}</span></label>
                                <input id="foto-card-slider" type="range" min="2" max="10" step="1" value={fotoCardCount} onChange={(e) => setFotoCardCount(Number(e.target.value))} disabled={isGenerating || isProcessing} />
                            </div>
                            {isGenerating && !aiAnalysis && !notification.includes('Analyzing') && <p className="notification">Generating flashcards...</p>}
                        </>
                    )}
                </div>
            )}
            {notification && <p className="notification">{notification}</p>}
            {generatedFlashcards.length > 0 && (
                <div className="card generated-cards-queue">
                    <div className="queue-header">
                        <h3>Review Queue</h3>
                        <button onClick={handleCheckAll} className="check-all-btn">Check All</button>
                    </div>
                    {generatedFlashcards.map(card => (
                        <div key={card.id} className="card generated-card">
                            <div className="card-selection">
                                <input type="checkbox" checked={!!checkedCards[card.id]} onChange={() => handleCardCheck(card.id)} />
                            </div>
                            <div className="card-content">
                                {renderCardContent(card, 'queue')}
                            </div>
                        </div>
                    ))}
                    <div className="folder-actions">
                        <select className="folder-select" value={selectedFolderForMove} onChange={(e) => setSelectedFolderForMove(e.target.value)}>
                            <option value="" disabled>Select a folder...</option>
                            {allFoldersForMoveDropdown.map(folder => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
                        </select>
                        <button onClick={handleMoveToFolder} className="move-to-folder-btn">Move to Folder</button>
                    </div>
                </div>
            )}
            <div className="card folders-container">
                <div className="folders-header">
                    <h2 className="section-heading-left">Your Folders</h2>
                    <button onClick={() => {
                        setModalConfig({ type: 'createFolder', onConfirm: handleCreateFolder });
                        setStudyingFolder(null);
                        setIsFeedbackModalOpen(false);
                    }} className="create-folder-btn">Create New Folder</button>
                </div>

                <div className="folder-sort-controls">
                    <label htmlFor="folder-sort">Sort by:</label>
                    <select id="folder-sort" className="folder-select" value={folderSortBy} onChange={(e) => setFolderSortBy(e.target.value)}>
                        <option value="name">Name</option>
                        <option value="dateCreated">Date Created</option>
                        <option value="lastViewed">Last Viewed</option>
                    </select>
                </div>
                <div className="folder-list">
                    {Object.values(folders).length > 0 ? getSortedFolders(folders).map(folder => (
                        <FolderItem
                            key={folder.id}
                            folder={folder}
                            level={0}
                            allFoldersForMoveDropdown={allFoldersForMoveDropdown}
                            onPlayGame={handlePlayGame}
                            expandedFolderIds={expandedFolderIds}
                            handleFolderToggle={handleFolderToggle}
                            handleFolderDragStart={handleFolderDragStart}
                            handleFolderDragOver={handleFolderDragOver}
                            handleFolderDrop={handleFolderDrop}
                            handleFolderDragEnd={handleFolderDragEnd}
                            getSortedFolders={getSortedFolders}
                            renderCardContent={renderCardContent}
                            setStudyingFolder={setStudyingFolder}
                            setModalConfig={setModalConfig}
                            setIsFeedbackModalOpen={setIsFeedbackModalOpen}
                            setFlashNotesActionModal={setFlashNotesActionModal}
                            setShowGamesModal={setShowGamesModal}
                            selectedCardsInExpandedFolder={selectedCardsInExpandedFolder}
                            handleSelectedCardInExpandedFolder={handleSelectedCardInExpandedFolder}
                            handleMoveSelectedCardsFromExpandedFolder={handleMoveSelectedCardsFromExpandedFolder}
                            handleCardInFolderDragStart={handleCardInFolderDragStart}
                            handleCardInFolderDrop={handleCardInFolderDrop}
                            isListening={isListening}
                            stopListening={stopListening}
                            exportFolderToPDF={exportFolderToPDF}
                            exportFolderToCSV={exportFolderToCSV}
                            handleAddSubfolder={handleAddSubfolder}
                            handleRenameFolder={handleRenameFolder}
                            handleDeleteFolder={handleDeleteFolder}
                            onStartExam={handleStartExam}
                            findFolderById={findFolderById}
                            folders={folders}
                            draggedFolderId={draggedFolderId}
                        />
                    )) : <p className="subtle-text">No folders created yet.</p>}
                </div>
            </div>
            <div className="app-footer">
                <button className="feedback-btn" onClick={() => {
                    setIsFeedbackModalOpen(true);
                    setStudyingFolder(null);
                    setModalConfig(null);
                }}>Send Feedback</button>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button className="game-action-btn" onClick={() => setShowDocViewer('eula')}>Terms and Conditions</button>
                    <button className="game-action-btn" onClick={() => setShowDocViewer('privacy')}>Privacy Policy</button>
                </div>
                <p className="footer-credit" style={{ marginTop: '1rem', color: 'var(--primary-purple)' }}>© FlashFonic, Trifecta Pro LLC</p>
            </div>
            {showDocViewer && (
                <DocViewer
                    docType={showDocViewer}
                    onClose={() => setShowDocViewer(null)}
                />
            )}
        </>
    );
};

// --- Top-Level App Component ---
const App = () => {
    const [showLanding, setShowLanding] = useState(true);
    const [showEulaModal, setShowEulaModal] = useState(false);
    const [showDocViewer, setShowDocViewer] = useState(null);
    const [appReady, setAppReady] = useState(false);
    const audioInitialized = useRef(false);

    const handleStartLandingFlow = async () => {
        const isDevMode = new URLSearchParams(window.location.search).get('dev') === 'true';
        const hasAcceptedEULA = localStorage.getItem('flashfonic-eula-accepted') === 'true';

        if (isDevMode) {
            setShowLanding(false);
            setShowEulaModal(true);
        } else if (hasAcceptedEULA) {
            if (!audioInitialized.current) {
                await Tone.start();
                console.log("AudioContext started for returning user.");
                audioInitialized.current = true;
            }
            setShowLanding(false);
            setAppReady(true);
        } else {
            setShowLanding(false);
            setShowEulaModal(true);
        }
    };

    const handleEULAAccept = async () => {
        const isDevMode = new URLSearchParams(window.location.search).get('dev') === 'true';
        
        if (!isDevMode) {
            localStorage.setItem('flashfonic-eula-accepted', 'true');
        }
        setShowEulaModal(false);
        
        if (!audioInitialized.current) {
            await Tone.start();
            console.log("AudioContext started after EULA acceptance.");
            audioInitialized.current = true;
        }
        setAppReady(true);
    };
    
    if (showLanding) {
        return <LandingPage onEnter={handleStartLandingFlow} />;
    }
    
    if (showEulaModal) {
        return <EULAModal onAccept={handleEULAAccept} />;
    }
    
    if (appReady) {
        return (
            <div className="main-app-container">
                <MainApp showDocViewer={showDocViewer} setShowDocViewer={setShowDocViewer} />
                {/* <Analytics /> */}
            </div>
        );
    }

    return null;
};

export default App;
