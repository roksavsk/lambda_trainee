import unittest
from correctarium_task import cost_calculation, deadline


class TestFunctions(unittest.TestCase):
    def test_cost(self):
        self.assertEqual(cost_calculation("eng", None, 1941), 232.92)
        self.assertEqual(cost_calculation("rus", "doc", 1941), 97.05)
        self.assertEqual(cost_calculation("eng", "docx", 970), 120)
        self.assertEqual(cost_calculation("eng", "other", 970), 139.68)
        self.assertEqual(cost_calculation("ukr", "rtf", 1216), 60.8)
        self.assertEqual(cost_calculation("ukr", "other", 10000), 600.0)

        self.assertNotEqual(cost_calculation("eng", "rtf", 1941), 0)
        self.assertNotEqual(cost_calculation("eng", "doc", 2500), 100)
        self.assertNotEqual(cost_calculation("ukr", "rtf", 1216), -90)

    def test_deadline(self):
        self.assertEqual(deadline("rus", "doc", 1941, "2021-11-30 11:15"), "2021-11-30 13:15:00")
        self.assertEqual(deadline("eng", "docx", 970, "2021-12-04 18:00"), "2021-12-06 13:00:00")
        self.assertEqual(deadline("eng", "other", 970, "2021-12-01 14:00"), "2021-12-01 17:00:00")
        self.assertEqual(deadline("ukr", "rtf", 1216, "2021-12-02 18:45"), "2021-12-03 10:45:00")
        self.assertEqual(deadline("rus", "doc", 2500, "2021-12-03 22:15"), "2021-12-06 12:00:00")
        self.assertEqual(deadline("ukr", "other", 10000, "2021-12-06 23:30"), "2021-12-07 18:00:00")

        self.assertNotEqual(deadline("eng", None, 1941), 0)
        self.assertNotEqual(deadline("rus", "doc", 1700), "01.12.2021 14:00")
        self.assertNotEqual(deadline("eng", "other", 970, "2021-12-01 14:00"), "2021-12-07 18:00:00")


if __name__ == '__main__':
    unittest.main()
