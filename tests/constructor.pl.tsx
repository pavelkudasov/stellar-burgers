import { expect, test } from '@playwright/test';

const accessToken = 'fake-access-token';
const refreshToken = 'fake-refresh-token';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/backend.har', {
      url: '**/api/**',
      notFound: 'abort',
    });
  });

  test('добавляет булку и начинку в конструктор', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();

    await page.getByRole('button', { name: 'Добавить' }).nth(0).click();
    await expect(page.getByTestId('constructor-bun-1')).toContainText('Тестовая булка');

    await page.getByRole('button', { name: 'Добавить' }).nth(1).click();
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      'Тестовая котлета'
    );
  });

  test('открывает модальное окно выбранного ингредиента и закрывает его крестиком', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Тестовая булка/ }).click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Тестовая булка' })).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toHaveCount(
      0
    );
    await expect(page).toHaveURL('http://127.0.0.1:4173/');
  });

  test('закрывает модальное окно ингредиента кликом по оверлею', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Тестовая булка/ }).click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toHaveCount(
      0
    );
    await expect(page).toHaveURL('http://127.0.0.1:4173/');
  });

  test('оформляет заказ, показывает его номер и очищает конструктор', async ({
    page,
  }) => {
    await page
      .context()
      .addCookies([
        { name: 'accessToken', value: accessToken, url: 'http://127.0.0.1:4173' },
      ]);
    await page.addInitScript((token) => {
      window.localStorage.setItem('refreshToken', token);
    }, refreshToken);

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
    await expect(page.getByText('Тестовый пользователь')).toBeVisible();

    await page.getByRole('button', { name: 'Добавить' }).nth(0).click();
    await page.getByRole('button', { name: 'Добавить' }).nth(1).click();
    await expect(page.getByTestId('constructor-bun-1')).toContainText('Тестовая булка');
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      'Тестовая котлета'
    );

    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(page.getByTestId('order-number')).toHaveText('123456');
    await expect(page.getByTestId('constructor-bun-1')).toHaveCount(0);
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      'Выберите начинку'
    );

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByTestId('order-number')).toHaveCount(0);
  });
});
