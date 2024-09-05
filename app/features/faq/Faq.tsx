import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { FaqContent } from './config'

type Props = {
  className?: string
}

export function Faq(props: Props) {
  return (
    <div className={props.className}>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-white/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-black dark:text-white">Frequently asked questions</h2>
          <dl className="mt-10 space-y-6 divide-y divide-black/10 dark:divide-white/10">
            {FaqContent.map((faq) => (
              <Disclosure key={faq.question} as="div" className="pt-6">
                <dt>
                  <DisclosureButton className="group flex w-full items-start justify-between text-left text-black dark:text-white">
                    <span className="text-base font-semibold leading-7">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      <FontAwesomeIcon icon={faPlus} className="h-6 w-6 group-data-[open]:hidden" />
                      <FontAwesomeIcon icon={faMinus} className="h-6 w-6 [.group:not([data-open])_&]:hidden" />
                    </span>
                  </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" className="mt-2 pr-12">
                  <p className="text-base leading-7 text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
