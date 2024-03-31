/// <reference types="Cypress" />

const elements = {
  handicapIndex: 'input[data-testid="handicap-index"]',
  teeSelector: 'select[data-testid="tee-selector"]',
  handicapAllowance: 'select[data-testid="handicap-allowance"]',
  handicapScore: 'p[data-testid="final-value"]',
}

describe("App E2E", () => {
  it("should prevent non-numeric entry to the handicap index input", () => {
    cy.visit("/")
    cy.get(elements.handicapIndex).focus().type("gibberish")
    cy.get(elements.handicapIndex).should("have.value", 0)
  })

  it("should prevent handicap index values above 54", () => {
    cy.visit("/")
    cy.get(elements.handicapIndex).focus().clear().type("56")
    cy.get(elements.handicapIndex).should("have.value", 54)

    cy.get(elements.handicapIndex).focus().clear().type("54{uparrow}")
    cy.get(elements.handicapIndex).should("have.value", 54)
  })

  it("should prevent handicap index values below -5", () => {
    cy.visit("/")

    cy.get(elements.handicapIndex)
      .focus()
      .clear()
      .type("-5")
      .type("{downarrow}")
    cy.get(elements.handicapIndex).should("have.value", -5)
  })

  it("should increment/decrement when the up/down arrow is pressed", () => {
    cy.visit("/")
    cy.get(elements.handicapIndex).focus().clear().type("0{uparrow}")
    cy.get(elements.handicapIndex).should("have.value", 0.1)

    cy.get(elements.handicapIndex)
      .focus()
      .clear()
      .type("0.1")
      .type("{downarrow}")
    cy.get(elements.handicapIndex).should("have.value", 0)

    cy.get(elements.handicapIndex).focus().clear().type("0{shift}{uparrow}")
    cy.get(elements.handicapIndex).should("have.value", 1)

    cy.get(elements.handicapIndex).focus().clear().type("1{shift}{downarrow}")
    cy.get(elements.handicapIndex).should("have.value", 0)
  })

  it("should calculate handicaps correctly", () => {
    cy.visit("/")

    cy.get(elements.handicapIndex).focus().clear().type("31.8").blur()
    cy.get(elements.teeSelector).select("Yellow 18h (119)")
    cy.get(elements.handicapAllowance).select("95%")
    cy.get(elements.handicapScore).should("contain.text", "31")
  })
})
