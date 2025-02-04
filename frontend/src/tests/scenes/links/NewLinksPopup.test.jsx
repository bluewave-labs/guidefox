import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import NewLinksPopup from '../../../scenes/links/NewLinksPopup';
import { AuthProvider } from '../../../services/authProvider';
import HelperLinkProvider from '../../../services/linksProvider';
import * as loginServices from '../../../services/loginServices';
import { GuideTemplateProvider } from '../../../templates/GuideTemplate/GuideTemplateContext';

vi.mock('../../../services/loginServices');
vi.mock('../../../services/helperLinkService');
vi.mock('../../../services/linkService');

const logIn = async () => {
  vi.spyOn(loginServices, 'signUp').mockResolvedValueOnce({
    token: 'mockAuthToken',
  });

  await act(async () => {
    await loginServices.signUp({
      name: 'test',
      surname: 'user',
      email: 'test_user@example.com',
      password: 'password123',
    });
    localStorage.setItem('authToken', 'mockAuthToken');
    localStorage.setItem('userInfo', JSON.stringify({ role: 'admin' }));
  });
};

const renderPopup = async () => {
  await logIn();
  return render(
    <GuideTemplateProvider>
      <Router>
        <AuthProvider>
          <HelperLinkProvider>
            <NewLinksPopup
              autoOpen
              isEdit={false}
              itemId={1}
              setItemsUpdated={() => {}}
            />
          </HelperLinkProvider>
        </AuthProvider>
      </Router>
    </GuideTemplateProvider>
  );
};

const addNewLink = async (title, url, target = true) => {
  // Proceed with clicking "+ Add new link" button
  const addNewLinkBtn = await screen.findByText('+ Add new link');
  await act(async () => {
    await userEvent.click(addNewLinkBtn);
  });

  // Continue with form interactions
  const settings = await screen.findByTestId('settings-form');
  expect(settings).to.exist;
  const inputs = settings.querySelectorAll('input');
  await act(async () => {
    await userEvent.type(inputs[1], title);
    await userEvent.type(inputs[2], url);
    if (target === false) {
      await userEvent.click(inputs[3]);
    }
    await userEvent.click(screen.getByTestId('close'));
  });
};

const openAppearance = async () => {
  const appearanceBtn = await screen.findByRole('button', {
    name: 'Appearance',
  });
  await act(async () => {
    await userEvent.click(appearanceBtn);
  });
};

describe('Test Helper Link popup', () => {
  it('Tests if the popup is rendered correctly', async () => {
    const { asFragment } = await renderPopup();
    expect(asFragment()).to.matchSnapshot();
  });
  describe('Test adding a new link', () => {
    it('should open the settings drawer when add new link is clicked', async () => {
      await renderPopup();
      const addNewLinkBtn = await screen.findByText('+ Add new link');
      await act(async () => {
        await userEvent.click(addNewLinkBtn);
      });
      const settings = await screen.findByTestId('settings-form');
      expect(settings).to.exist;
      const inputs = settings.querySelectorAll('input');
      expect(inputs).toHaveLength(4);
      expect(inputs[0]).toHaveProperty('name', 'id');
      expect(inputs[1]).toHaveProperty('name', 'title');
      expect(inputs[2]).toHaveProperty('name', 'url');
      expect(inputs[3]).toHaveProperty('name', 'target');
    });
    it('should add the new link to links list and to the preview when a new link is created', async () => {
      await renderPopup();
      await addNewLink('link 1', 'http://link1.com.br');
      const links = await screen.findAllByText('link 1');
      expect(links).toHaveLength(2);
      expect(links[1]).toHaveProperty('href', 'http://link1.com.br/');
      expect(links[1]).toHaveProperty('target', '_blank');
    });
    it('should add the new link to links list and to the preview with the correct target when a new link is created', async () => {
      await renderPopup();
      await addNewLink('link 1', 'http://link1.com.br');
      let links = await screen.findAllByText('link 1');
      expect(links).toHaveLength(2);
      expect(links[1]).toHaveProperty('href', 'http://link1.com.br/');
      expect(links[1]).toHaveProperty('target', '_blank');

      await addNewLink('link 2', 'http://link2.com.br', false);
      links = await screen.findAllByText('link 2');
      expect(links).toHaveLength(2);
      expect(links[1]).toHaveProperty('href', 'http://link2.com.br/');
      expect(links[1]).toHaveProperty('target', '_self');
    });
    it.skip('should change the order of the links on preview after drag', async () => {
      await renderPopup();
      await addNewLink('link 1', 'http://link1.com.br');
      await addNewLink('link 2', 'http://link2.com.br');
      await addNewLink('link 3', 'http://link3.com.br');
      const links = await screen.findAllByText(/link \d/, { selector: 'span' });
      const linksContainer = screen.getByTestId('cards');
      const listItems = linksContainer.querySelectorAll('li');
      expect(links).toHaveLength(3);
      expect(links.map((it) => it.innerHTML)).toEqual([
        'link 1',
        'link 2',
        'link 3',
      ]);

      await act(async () => {
        await userEvent.pointer([
          { keys: '[MouseLeft>]', target: listItems[0] },
          { keys: '[MouseLeft]', target: listItems[2] },
          { keys: '[/MouseLeft]' },
        ]);
      });

      await waitFor(async () => {
        const updatedLinks = await screen.findAllByText(/link \d/, {
          selector: 'span',
        });

        expect(updatedLinks).toHaveLength(3);
        expect(updatedLinks.map((it) => it.innerHTML)).not.toEqual([
          'link 1',
          'link 2',
          'link 3',
        ]);
      });
    });
  });
  describe('Test the appearance and the preview', () => {
    it('should display the appearance form when the button is clicked', async () => {
      await renderPopup();
      await openAppearance();
      const inputs = (
        await screen.findByTestId('appearance-form')
      ).querySelectorAll('input');

      expect(inputs).toHaveLength(7);
      expect(inputs[0]).toHaveProperty('name', 'title');
      expect(inputs[1]).toHaveProperty('name', 'url');
      expect(inputs[2]).toHaveProperty('name', 'absolutePath');
      expect(inputs[3]).toHaveProperty('name', 'headerBackgroundColor');
      expect(inputs[4]).toHaveProperty('name', 'linkFontColor');
      expect(inputs[5]).toHaveProperty('name', 'iconColor');
      expect(inputs[6]).toHaveProperty('name', 'active');
    });
    it('should change the title on the preview when a title is typed', async () => {
      await renderPopup();
      await openAppearance();
      const titleInput = await screen.findByLabelText('Header text');
      await userEvent.type(titleInput, 'Title');
      const preview = await screen.findByText('Title');
      expect(preview).to.exist;
    });
    it('should change the background color of the header if the color is changed', async () => {
      await renderPopup();
      await openAppearance();
      const previewHeader = (
        await screen.findByTestId('preview')
      ).querySelector('.preview__card--header');
      expect(getComputedStyle(previewHeader).backgroundColor).toBe(
        'rgb(248, 249, 248)'
      );
      const form = await screen.findByTestId('appearance-form');
      const headerColorInput = form.querySelector('input#header-bg');
      const headerColorLabel = form.querySelector('span.header');
      await act(async () => {
        await userEvent.pointer(headerColorInput, {});
        fireEvent.change(headerColorInput, {
          target: { value: '#f2f2f2' },
        });
      });
      expect(headerColorLabel.innerHTML).toBe('#f2f2f2');
      expect(getComputedStyle(previewHeader).backgroundColor).toBe(
        'rgb(242, 242, 242)'
      );
    });
    it('should change the link text color if the color is changed', async () => {
      await renderPopup();
      await addNewLink('link 1', 'http://localhost:4321');
      await openAppearance();
      const previewLink = (await screen.findByTestId('preview')).querySelector(
        'li.preview__card--item a'
      );
      expect(getComputedStyle(previewLink).color).toBe('rgb(52, 64, 84)');
      const form = await screen.findByTestId('appearance-form');
      const linkColorInput = form.querySelector('input#link-color');
      const linkColorLabel = form.querySelector('span.link');
      await act(async () => {
        fireEvent.change(linkColorInput, {
          target: { value: '#000' },
        });
      });
      expect(linkColorLabel.innerHTML).toBe('#000000');
      expect(getComputedStyle(previewLink).color).toBe('rgb(0, 0, 0)');
    });
    it('should change the icon color if the color is changed', async () => {
      await renderPopup();
      await addNewLink('link 1', 'http://localhost:4321');
      await openAppearance();
      const previewIcon = (await screen.findByTestId('preview')).querySelector(
        '.preview__card--icon'
      );
      expect(previewIcon.querySelector('path').getAttribute('stroke')).toBe(
        '#7F56D9'
      );
      const form = await screen.findByTestId('appearance-form');
      const iconColorInput = form.querySelector('input#icon');
      const iconColorLabel = form.querySelector('span.icon');
      await act(async () => {
        fireEvent.change(iconColorInput, {
          target: { value: '#000' },
        });
      });
      expect(iconColorLabel.innerHTML).toBe('#000000');
      expect(previewIcon.querySelector('path').getAttribute('stroke')).toBe(
        '#000000'
      );
    });
  });
});
