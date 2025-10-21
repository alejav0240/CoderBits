from django.test import TestCase
from django.urls import reverse


class AnalyticsViewTests(TestCase):
    def test_analytics_view_returns_expected_structure(self):
        url = reverse('dashboard-analytics')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        # Check top-level keys
        self.assertIn('hourly', data)
        self.assertIn('byType', data)
        self.assertIn('bySeverity', data)
        # Check types
        self.assertIsInstance(data['hourly'], list)
        self.assertIsInstance(data['byType'], list)
        self.assertIsInstance(data['bySeverity'], list)
        # Check sample content
        if data['hourly']:
            self.assertIn('hour', data['hourly'][0])
            self.assertIn('count', data['hourly'][0])
        if data['byType']:
            self.assertIn('name', data['byType'][0])
            self.assertIn('value', data['byType'][0])
        if data['bySeverity']:
            self.assertIn('severity', data['bySeverity'][0])
            self.assertIn('count', data['bySeverity'][0])
