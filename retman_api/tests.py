from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIRequestFactory, APIClient

from retman_api.models import Customer, Membership, Visitation, Payment


class TestAPI(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()
        self.uri = '/v1/customers/'
        self.user = self.setup_user()
        self.client.force_authenticate(user=self.user)

    @staticmethod
    def setup_user():
        User = get_user_model()
        user = User.objects.create(username='test')
        user.set_password('test')
        return user

    def assertEqualStatus(self, response, status, extra=''):
        self.assertEqual(response.status_code, status,
                         'Expected Response Code {}, received {} instead. {}'
                         .format(status, response.status_code, extra))

    def test_create_customer(self):
        data = {'card_id': 10, 'full_name': 'Реутов Никита'}
        response = self.client.post(self.uri, data)
        response_get = self.client.get(self.uri)
        self.assertEqualStatus(response, 201)
        self.assertEqual(len(Customer.objects.all()), 1, 'Customer not created')
        self.assertEqual(response_get.data[0]['full_name'], 'Реутов Никита', '/customers/ not returning customer')

        data = {'card_id': 11, 'full_name': 'Никита Реутов'}
        response = self.client.post(self.uri, data)
        response_get = self.client.get(self.uri)
        self.assertEqualStatus(response, 201)
        self.assertEqual(len(Customer.objects.all()), 2, 'Second customer not created')
        self.assertEqual(len(response_get.data), 2, '/customers/ not returning second customer')
        self.assertEqual(response_get.data[1]['full_name'], 'Никита Реутов', '/customers/ not returning second customer')

    def test_patch_customer(self):
        data = {'card_id': 101, 'full_name': 'Реутов Никита'}
        self.client.post(self.uri, data)
        patch_response = self.client.patch(self.uri + '1/', {'full_name': 'Никита Реутов'})
        self.assertEqualStatus(patch_response, 200)
        self.assertEqual(patch_response.data['full_name'], 'Никита Реутов')

    def test_create_customer_with_full_info(self):
        data = {'card_id': 10, 'full_name': 'Реутов Никита', 'birth_date': '1999-01-29',
                'phone_number': '89153734389', 'amount_of_available_visitations': 10}
        response = self.client.post(self.uri, data)
        response_get = self.client.get(self.uri)
        self.assertEqualStatus(response, 201)
        self.assertEqual(len(Customer.objects.all()), 1, 'Customer not created')
        self.assertEqual(response_get.data[0]['birth_date'], '1999-01-29', 'Wrong date')
        self.assertEqual(response_get.data[0]['phone_number'], '89153734389', 'Wrong phone number')
        self.assertEqual(response_get.data[0]['amount_of_available_visitations'], 10, 'Wrong visitations')

    def test_membership_create_and_retrieve(self):
        data = {'card_id': 10, 'full_name': 'Реутов Никита'}
        response = self.client.post(self.uri, data)
        response_create = self.client.post(self.uri + '1/membership/')
        response_get = self.client.get(self.uri + '1/membership/')
        self.assertEqualStatus(response, 201)
        self.assertEqualStatus(response_create, 201)
        self.assertEqual(len(Membership.objects.all()), 1, 'Membership not created')
        self.assertEqual(response_get.data['id'], 1, 'Wrong active membership')

    def test_if_there_is_no_membership(self):
        data = {'card_id': 10, 'full_name': 'Реутов Никита'}
        response = self.client.post(self.uri, data)
        response_get = self.client.get(self.uri + '1/membership/')
        self.assertEqualStatus(response, 201)
        self.assertEqualStatus(response_get, 400)
        self.assertEqual(response_get.data, "Customer don't have a membership",
                         "There's no membership, but returns one")
        response_create2 = self.client.post(self.uri + '1/membership/', {'enrollment_date': '2018-08-10T00:00'})
        response_get = self.client.get(self.uri + '1/membership/')
        self.assertEqualStatus(response_create2, 201)
        self.assertEqualStatus(response_get, 400)
        self.assertEqual(response_get.data, "Customer don't have a membership",
                         'There is no membership, but returns one')


    def test_visitation_create_retrieve_close(self):
        data = {'card_id': 10, 'full_name': 'Реутов Никита', 'amount_of_available_visitations': 10}
        self.client.post(self.uri, data)

        r0 = self.client.post(self.uri + '1/visitation/')
        self.assertEqualStatus(r0, 201)
        self.assertEqual(r0.data['id'], 1, 'Creation dont return object')

        r1 = self.client.get(self.uri + '1/visitation/')
        self.assertEqualStatus(r1, 200)

        r2 = self.client.get(self.uri + '1/visitation/close/')
        self.assertEqualStatus(r1, 200)

        r3 = self.client.post(self.uri + '1/visitation/')
        self.assertEqualStatus(r3, 201)
        self.assertEqual(r3.data['id'], 2, 'Creation dont return object')

    def test_visitations_list(self):
        data = {'card_id': 10, 'full_name': 'Реутов Никита', 'amount_of_available_visitations': 10}
        self.client.post(self.uri, data)
        self.client.post(self.uri + '1/visitation/', {'key_number': 1})
        self.client.get(self.uri + '1/visitation/close/')
        self.client.post(self.uri + '1/visitation/')
        response = self.client.get(self.uri + '1/visitations/')
        print(response.data)
        self.assertEqualStatus(response, 200)
        self.assertEqual(len(response.data), 2, 'Wrong list visitations')

        data = {'card_id': 11, 'full_name': 'Никита Реутов', 'amount_of_available_visitations': 10}
        self.client.post(self.uri, data)
        self.client.post(self.uri + '2/visitation/')
        self.client.get(self.uri + '2/visitation/close/')
        self.client.post(self.uri + '2/visitation/')
        response = self.client.get(self.uri + '2/visitations/')
        self.assertEqualStatus(response, 200)
        self.assertEqual(len(response.data), 2, 'Wrong list visitations')

    def test_visitations_heatmap(self):
        data = {'card_id': 10, 'full_name': 'Реутов Никита', 'amount_of_available_visitations': 10}
        self.client.post(self.uri, data)
        self.client.post(self.uri + '1/visitation/')
        self.client.get(self.uri + '1/visitation/close/')
        self.client.post(self.uri + '1/visitation/')
        r0 = self.client.get('/v1/visitations/get_data_heatmap/')
        self.assertEqualStatus(r0, 200)

    # def test_payments_list(self):
    #     data = {'card_id': 10, 'full_name': 'Реутов Никита', 'amount_of_available_visitations': 10}
    #     self.client.post(self.uri, data)
    #     self.client.post(self.uri + '1/visitations/add/', {'amount': 10, 'value': 1300})
    #     selкf.client.post(self.uri + '1/visitations/add/', {'amount': 10, 'value': 1300})
    #     r = self.client.get('/v1/payments/')
    #     print(r.data[0])
