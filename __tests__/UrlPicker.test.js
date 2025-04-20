import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import UrlPicker from '../UrlPicker';
import fetchMock from 'fetch-mock';

fetchMock.mockGlobal().get('http://mkr.local.me', [{ id: 1, name: "Test" }, { id: 2, name: "Test 2" }]);

test('URL picker renders correctly', async () => {
  render(<UrlPicker url="http://mkr.local.me" enabled={true} onItemPicked={() => {}} />);
    
  const picker = await screen.findByTestId('url-picker');
  expect(picker).toBeOnTheScreen();
});