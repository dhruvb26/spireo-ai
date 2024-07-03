export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold md:text-4xl">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground">
          At Acme Inc., we are committed to protecting the privacy and security
          of your personal information. This Privacy Policy outlines how we
          collect, use, and safeguard your data.
        </p>
        <section>
          <h2 className="text-2xl font-bold">Information We Collect</h2>
          <p className="text-muted-foreground">
            We may collect the following types of information from you:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Personal Information:</strong> Your name, email address,
              phone number, and other contact details.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you use our
              website or services, including your IP address, browser type, and
              device information.
            </li>
            <li>
              <strong>Payment Information:</strong> If you make a purchase, we
              may collect your payment details, such as credit card information.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold">How We Use Your Information</h2>
          <p className="text-muted-foreground">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Providing Our Services:</strong> To deliver the products
              and services you request and to improve our offerings.
            </li>
            <li>
              <strong>Communicating with You:</strong> To respond to your
              inquiries, send you updates, and provide customer support.
            </li>
            <li>
              <strong>Personalizing Your Experience:</strong> To customize the
              content and features you see based on your preferences and
              interactions.
            </li>
            <li>
              <strong>Protecting Our Business:</strong> To detect and prevent
              fraud, enforce our policies, and comply with legal requirements.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold">
            How We Protect Your Information
          </h2>
          <p className="text-muted-foreground">
            We take the security of your personal information seriously and have
            implemented the following measures to protect it:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Encryption:</strong> We use industry-standard encryption
              technologies to secure your data during transmission and storage.
            </li>
            <li>
              <strong>Access Controls:</strong> We limit access to your
              information to only those employees and third-party service
              providers who need it to perform their duties.
            </li>
            <li>
              <strong>Monitoring and Auditing:</strong> We regularly monitor our
              systems and processes to detect and prevent unauthorized access or
              misuse of your data.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold">Your Rights and Choices</h2>
          <p className="text-muted-foreground">
            You have the following rights and choices regarding your personal
            information:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Access and Correction:</strong> You can request access to
              the personal information we hold about you and ask us to correct
              any inaccuracies.
            </li>
            <li>
              <strong>Deletion:</strong> You can request that we delete your
              personal information, subject to certain exceptions.
            </li>
            <li>
              <strong>Opt-Out:</strong> You can opt-out of receiving marketing
              communications from us by following the unsubscribe instructions
              in the emails or by contacting us.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions or concerns about our Privacy Policy or
            the way we handle your personal information, please don't hesitate
            to contact us:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Email:</strong> support@spireo.ai
            </li>
            <li>
              <strong>Phone:</strong> +1 (555) 123-4567
            </li>
            <li>
              <strong>Address:</strong> 123 Main Street, Anytown USA 12345
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
