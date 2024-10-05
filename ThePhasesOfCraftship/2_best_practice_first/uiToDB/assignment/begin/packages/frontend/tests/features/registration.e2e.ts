
import { defineFeature, loadFeature } from 'jest-cucumber';
import { sharedTestRoot } from '@dddforum/shared/src/paths';
import { CreateUserParams } from "@dddforum/shared/src/api/users";

import * as path from 'path';
import { DatabaseFixture } from '@dddforum/shared/tests/support/fixtures/databaseFixture';
import { CreateUserBuilder } from '@dddforum/shared/tests/support/builders/createUserBuilder';
import { afterEach } from 'node:test';
import { App, Pages, createAppObject } from '../support/pages';
import { PuppeteerPageDriver } from '../support/driver';

const feature = loadFeature(path.join(sharedTestRoot, 'features/registration.feature'), { tagFilter: '@frontend' });


defineFeature(feature, (test) => {
  let app: App
  let pages: Pages
  let puppeteerPageDriver: PuppeteerPageDriver
  let userInput: CreateUserParams
  let databaseFixture: DatabaseFixture


  beforeAll(async () => {
    databaseFixture = new DatabaseFixture();
    puppeteerPageDriver = await PuppeteerPageDriver.create({
      headless: false,
      slowMo: 500
    })
    app = createAppObject(puppeteerPageDriver)
    pages = app.pages
  });

  afterAll(async () => {
    await puppeteerPageDriver.close();
  });

  afterEach(async () => {
    await databaseFixture.resetDatabase();
  });

  // Need to put timeout here.
  jest.setTimeout(60000);

  test('Successful registration with marketing emails accepted', ({ given, when, then, and }) => {

    given('I am a new user', async () => {
      userInput = new CreateUserBuilder()
        .withAllRandomDetails()
        .build();

      await pages.registration.open();
      await pages.registration.acceptMarketingEmails();
    });

    when('I register with valid account details accepting marketing emails', async () => {
      await pages.registration.enterAccountDetails(userInput);
      await pages.registration.acceptMarketingEmails();
      await pages.registration.submitRegistrationForm();
    });

    then('I should be granted access to my account', async () => {
      expect(await app.header.getUsernameFromHeader()).toContain(userInput.username);
    });

    and('I should expect to receive marketing emails', () => {
      // @See backend 
    });
  });


  test('Invalid or missing registration details', ({ given, when, then, and }) => {
    given('I am a new user', async () => {
    });

    when('I register with invalid account details', async () => {
    });

    then('I should see an error notifying me that my input is invalid', async () => {
    });

    and('I should not have been sent access to account details', () => {
      // @See backend 
    });
  });

  test('Account already created with email', ({ given, when, then, and }) => {
    given('a set of users already created accounts', async (table: CreateUserParams[]) => {
    });


    when('new users attempt to register with those emails', async () => {
    });

    then('they should see an error notifying them that the account already exists', async () => {
    });

    and('they should not have been sent access to account details', () => {
      // @See backend 
    })
  });
});
