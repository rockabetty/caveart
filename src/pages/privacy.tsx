import React from 'react';
import CaveartLayout from '../app/user_interface/CaveartLayout';
import { Link } from '@components';

function PrivacyPolicy() {
  return (
    <CaveartLayout>
      <article className="tile">
        <h1>Privacy Policy</h1>

        <p>
          This privacy policy describes how and why we might collect and use your information when you use our platform.  If you have any questions, then send an email to <strong>hello@caveartwebcomics.com</strong>.
        </p>

        <h2>TL'DR</h2>
        <p>
          We collect personal information when you use our platform, like your password.
        </p>

        <p>
          You can see and edit or delete all of this information by going to <Link type="inline" href="account">https://www.caveartwebcomics.com/account</Link>. 
        </p>

        <p>
          We attempt to safeguard your personal information, but make no guarantees. No website is truly safe from hackers.
        </p>

        <h2>The Information We Collect</h2>
        <p>
        We ask you for your email, password, and username.  These pieces of information are required to have an account.  Your email is encrypted and your password is hashed.</p>
        <p>You can optionally tell us about your personal content preferences or fill out fields in your profile.  This is optional and naturally we will store whatever information you give us as an automatic process.</p>

        <p>
        We also either currently collect the following technical data, or have plans to collect the following once we have coded it in:
        </p>

        <ul>
          <li><b>Log and usage data:</b> We collect service-related, diagnostic, usage and performance information and record them in log files.  This log data might include your IP address, device information (e.g. if it's a mobile phone), browser type, your account settings for Caveart, and error reports.          </li>
          <li><b>Device data:</b> We collect information about your device (your IP address, hardware in use, browser type).</li>
          <li><b>Location data:</b> We try to detect what your preferred language is by looking at your browser's language settings and/or IP address which will tell us your rough location. You can opt out of this by refusing access in your browser, or disabling your Location setting in your device. </li>
        </ul>

        <p>
         Do not send us sensitive information ("sensitive" information is stuff like financial or health information).  We do not want it and we do not need it. Your sensitive information is your responsibility to protect and your responsibility alone. 
        </p>

        <h2>How We Use Your Information</h2>
        <p>
        We use the information you provide in order to make the website actually work.  You can deny us access to this information, but you won't be able to use any features or service that depend on that information.</p>

        <p>Here's a breakdown of how we use it:</p>
        <ul>
          <li>
            So that you can create, log into, and edit or delete your account
          </li>
          <li>
            So that you can use services that rely on knowing which user you are (e.g. so you can create and manage content)
          </li>
          <li>
            To email you with any important updates like changes to our policies
          </li>
          <li>
            To allow you to communicate with other users
          </li>
          <li>
            To protect our website and our users from malicious users
          </li>
          <li>
            To identify usage trends so we can improve the website
          </li>
        </ul>

        <h2>How Long We Keep Your Information</h2>
        <p>
          We keep your information until you delete your account unless otherwise required by law.
        </p>
        <p>
          We keep your information until you delete your account.  If you do delete your account, please note that this does not necessarily delete every single trace of your presence (unless otherwise required by law). For example, comments that you have made will be rendered anonymous instead of being deleted (you can still delete the comments themselves but will need to do so yourself).  If your account is under investigation for harrassment or unlawful activity, we are under no obligation to accomodate your personal desire to delete incriminating information. 
        </p>

        <h2>We Do Not Sell Your Information</h2>
        <p>
        We do not disclose or sell your information to third parties for business or commercial purposes or any other purposes.
        </p>

        <h2>How To Delete Your Information</h2>
        <p>
          If you are having trouble finding out how to delete or alter your account information through your account settings page, you can contact us at hello@caveartwebcomics.com to have your information deleted. When you do that, there will be a necessary verification process so that we are actually sure that you are who you say you are.  We will have to contact you through the email address that you used to send this request.  Please keep in mind that CaveArt is not a paid service and its moderators have jobs outside of the website, so we do not have a dedicated team that will swiftly respond.
        </p>

        <h2>Countermeasures Against Art Generating AI</h2>
        <p>
          Different artists have different concerns about what AI means for their own work.  We want our artists to be able to protect their work if they feel the need to do so, but as a website made by unpaid hobbyists we absolutely can not guarantee that we can safeguard your content because we don't know how that stuff works in the first place. That said, here is some useful information.
        </p>
          <ul>
            <li><Link target="_blank" type="inline" href="https://glaze.cs.uchicago.edu/">Glaze</Link> is a measure meant to thwart art generation AIs by throwing off their ability to mimic your style.  You should check it out and determine for yourself whether to use it.  We have no affiliation with Glaze or its creators.  We do have plans to integrate Glaze (or an equivalent) into the website, but it is a stretch goal that has currently not yet been achieved.</li>
            <li><Link target="_blank" type="inline" href="https://policies.google.com/privacy?hl=en-US">Google's privacy policy</Link> says it lets anything its spider access be used as training data for AI.   Spiders rely on things like links to pages (which search results provide) in order to consume them, so one way to pull the plug on Google is to mark your comic as Unlisted. That way someone needs the direct link to see your work.</li>
            <li>Google can't scrape pages that it doesn't have access to. If you mark your comic as login-only, your comic profile shows up in searches but when someone tries to read it, they need to be logged in. That way, new people can find your comic, but they have to be logged in to get past the cover, so the only thing Google is going to get is your cover image (since that is on the profile page which shows up in the search results).</li>
          </ul>
        

        <h2>Updates To The Policy</h2>
        <p>
          We may revise the Privacy Policy from time to time, and when we do, the changes will not be retroactive.  The most current version of the Privacy Policy are always here at caveart.com/privacy. We will try to notify you of material revisions via the email associated with your account.
        </p>

        <h2>Cookies And Tracking</h2>
        <p>
          We use cookies to keep you logged in.  To avoid having those set, don't create an account and don't log in. 
        </p>
        <p>
          When users look at a page we do record page view counts, so we technically do 'track' you in order to tell our comic artists how many people read their stuff.
        </p>

        <h2>Your Rights According To Where You Live</h2>

        <h3>For EU and UK Residents</h3>
        <p>
          If you live in the EU or the UK, this section applies to you. You are protected under the General Data Protection Regulation (GDPR). Here are the legal bases to process your personal information:
        </p>

        <ul>
          <li>
            <b>Consent.</b> We may process your information if you give us permission to do so.  You supplying us your information by filling out forms on our website (such as the sign up form) constitutes permission to do so.  You can withdraw this consent at any time by email to hello@caveartwebcomics.com.
          </li>
          <li>
            <b>Legitimate interests.</b> We may process your information when we believe it is reasonably necessary to achieve our goals and those goals do not outweigh your own personal interests, rights, or freedoms.  So for example, we may process your personal information to diagnose problems or prevent fraudulent activities, or analyze how our services are used so we can improve them.
          </li>
          <li>
            <b>Legal obligations.</b> We may process your information where we belive it is necessary to comply with a law enforcement or regulatory agency, exercise or defend our own legal rights, or disclose your information as evidence in litigation if we ever are involved in such a thing.
          </li>
        </ul>

        <h3>For Canadian Residents</h3>
        <p>
          If you are in Canada, this section applies to you.  We may process your information if you have given us specific permission to do so for a specific purpose or where your permission is implied.  You can withdraw your consent at any time by emailing hello@caveartwebcomics.com. 
        </p>

        <p>
          There are some cases where we are legally permitted to process your information without your consent.  For example, if we are legally required to disclose your information, or for fraud detection and prevention.
        </p>

        <h3>For Californians</h3>
        <p>If you are a resident of California, you should know about <Link type="inline" href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=1798.83.&lawCode=CIV">California Civil Code Section 1798.83</Link> (the "Shine The Light" law).  Once a year and free of charge you may request to obtain information about personal information (if any) we disclosed to third parties.  In advance, we do not actually disclose information to third parties, but you have the legal right to check anyway!  Email us at hello@caveartwebcomics.com.</p>

        <p>
          You have the right to request that we delete your data, to get a report on what sort of data we've been collecting over the past 12 months, and to be informed in full about whether, how, and why we collect data. 
        </p>

        <p>If you are a California resident under 18 years of age then you have the right to request removal of any unwanted data that you publicly post on Caveart by contacting us at hello@caveartwebcomics.com.  Please be aware that depending on how we store our data at any given time the removal might not be complete or comprehensive.
        </p>

        <h3>For Virginians</h3>
        <p>
        If you are a resident of Virginia, you should know about the Virginia Consumer Data Protection Act (VCDPA). The information we collect depends on how you interact with the platform.  The data we collect, how we use it, and when and with whom we share that data is accessible on this page.
        </p>
      </article>
    </CaveartLayout>
  )
}

export default PrivacyPolicy