import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Introduction</h2>
          <p className="mt-2 text-muted-foreground">
            Welcome to our platform. By accessing or using our services, you
            agree to be bound by these terms of service and our privacy policy.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">User Responsibilities</h2>
          <ul className="mt-2 space-y-2 text-muted-foreground">
            <li>
              <span className="font-medium">Account Registration:</span> You
              must provide accurate and complete information when creating an
              account.
            </li>
            <li>
              <span className="font-medium">Acceptable Use:</span> You agree to
              use our services only for lawful purposes and in accordance with
              these terms.
            </li>
            <li>
              <span className="font-medium">Content Ownership:</span> You retain
              ownership of any content you upload or share, but you grant us a
              license to use it as necessary to provide our services.
            </li>
            <li>
              <span className="font-medium">Prohibited Activities:</span> You
              agree not to engage in any illegal, harmful, or fraudulent
              activities while using our services.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Intellectual Property</h2>
          <p className="mt-2 text-muted-foreground">
            Our platform and all of its content are owned by us and are
            protected by copyright, trademark, and other intellectual property
            laws. You may not modify, copy, distribute, transmit, display,
            reproduce, or create derivative works from our platform without our
            prior written consent.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Limitation of Liability</h2>
          <p className="mt-2 text-muted-foreground">
            We will not be liable for any indirect, special, incidental, or
            consequential damages arising out of or related to your use of our
            services. Our total liability shall not exceed $100.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Termination</h2>
          <p className="mt-2 text-muted-foreground">
            We reserve the right to suspend or terminate your access to our
            services at any time for any reason, including if we reasonably
            believe you have violated these terms.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Governing Law</h2>
          <p className="mt-2 text-muted-foreground">
            These terms shall be governed by and construed in accordance with
            the laws of [Jurisdiction], without giving effect to any principles
            of conflicts of law.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Changes to Terms</h2>
          <p className="mt-2 text-muted-foreground">
            We reserve the right to modify these terms at any time. Any changes
            will be effective upon posting the revised terms on our platform.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <p className="mt-2 text-muted-foreground">
            If you have any questions or concerns about these terms, please
            contact us at{" "}
            <Link href="#" prefetch={false}>
              support@spireo.ai
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
